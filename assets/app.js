/* Minimal jQuery-based News app using newsapi.org */
$(function () {
  const API_BASE = 'https://newsapi.org/v2/top-headlines';
  const PLACEHOLDER_IMG = 'https://via.placeholder.com/600x300?text=No+Image';
  const state = {
    apiKey: (window.NEWS_API_KEY || '').trim(),
    country: localStorage.getItem('NEWS_COUNTRY') || 'us',
    category: '',
    page: 1,
    pageSize: 9,
    totalResults: 0,
  };

  // Elements
  const $articles = $('#articles');
  const $status = $('#status');
  const $prev = $('#prevBtn');
  const $next = $('#nextBtn');
  const $pageInfo = $('#pageInfo');
  const $countrySelect = $('#countrySelect');

  // Initialize UI
  $countrySelect.val(state.country);

  // Category click
  $('#categories').on('click', 'button', function () {
    $('#categories button').removeClass('active');
    $(this).addClass('active');
    state.category = $(this).data('cat') || '';
    state.page = 1;
    fetchNews();
  });

  // Country change
  $countrySelect.on('change', function () {
    state.country = $(this).val();
    localStorage.setItem('NEWS_COUNTRY', state.country);
    state.page = 1;
    fetchNews();
  });

  // Pagination
  $prev.on('click', function () {
    if (state.page > 1) {
      state.page--;
      fetchNews();
    }
  });
  $next.on('click', function () {
    const totalPages = Math.max(1, Math.ceil(state.totalResults / state.pageSize));
    if (state.page < totalPages) {
      state.page++;
      fetchNews();
    }
  });

  // Share handler (event delegation)
  $articles.on('click', '.share-btn', async function () {
    const url = $(this).data('url');
    const title = $(this).closest('.card').find('.card-title').text() || 'News';
    try {
      if (navigator.share) {
        await navigator.share({ title, url });
      } else {
        const tw = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`;
        window.open(tw, '_blank');
      }
    } catch (e) {
      // ignored
    }
  });

  function setLoading(loading, msg) {
    if (loading) {
      $status.text(msg || 'Loading…');
    } else {
      $status.text(msg || '');
    }
  }

  function renderArticles(articles) {
    if (!articles || !articles.length) {
      $articles.html('<div class="col-12 text-center text-muted py-4">No news found.</div>');
      return;
    }
    const cards = articles.map(a => {
      const img = a.urlToImage || PLACEHOLDER_IMG;
      const title = a.title || '';
      const desc = a.description || '';
      const src = a.source && a.source.name ? a.source.name : '';
      const date = a.publishedAt ? new Date(a.publishedAt).toLocaleString() : '';
      const url = a.url || '#';
      return `
      <div class="col-12 col-md-6 col-lg-4">
        <div class="card h-100">
          <img src="${img}" class="card-img-top" alt="thumbnail" onerror="this.src='${PLACEHOLDER_IMG}'" />
          <div class="card-body d-flex flex-column">
            <h6 class="card-title">${escapeHtml(title)}</h6>
            <p class="card-text small flex-grow-1">${escapeHtml(desc)}</p>
            <div class="d-flex justify-content-between align-items-center mt-2">
              <small class="text-muted">${escapeHtml(src)} · ${escapeHtml(date)}</small>
              <div class="btn-group btn-group-sm">
                <a class="btn btn-primary" href="${url}" target="_blank" rel="noopener">Open</a>
                <button class="btn btn-outline-secondary share-btn" data-url="${url}">Share</button>
              </div>
            </div>
          </div>
        </div>
      </div>`;
    });
    $articles.html(cards.join(''));
  }

  function updatePager() {
    const totalPages = Math.max(1, Math.ceil(state.totalResults / state.pageSize));
    $prev.prop('disabled', state.page <= 1);
    $next.prop('disabled', state.page >= totalPages);
    $pageInfo.text(`Page ${state.page} of ${totalPages}`);
  }

  function buildUrl() {
    const params = new URLSearchParams({
      country: state.country,
      page: String(state.page),
      pageSize: String(state.pageSize),
    });
    if (state.category) params.set('category', state.category);
    // Using apiKey in query keeps code minimal; for real apps, proxy server is recommended.
    if (state.apiKey) params.set('apiKey', state.apiKey);
    return `${API_BASE}?${params.toString()}`;
  }

  async function fetchNews() {
    $articles.empty();
    setLoading(true, 'Loading news…');
    if (!state.apiKey) {
      setLoading(false, 'Missing NEWS_API_KEY. Set it via assets/env.js');
      renderArticles([]);
      updatePager();
      return;
    }

    try {
      const url = buildUrl();
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.status !== 'ok') throw new Error(data.message || 'API error');
      state.totalResults = data.totalResults || 0;
      renderArticles(data.articles || []);
      updatePager();
      setLoading(false, `Showing ${data.articles?.length || 0} of ${state.totalResults}`);
    } catch (err) {
      console.error(err);
      setLoading(false, 'Failed to load news. Check API key, CORS, or quota.');
      renderArticles([]);
      updatePager();
    }
  }
  

  function escapeHtml(s) {
    return String(s || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // Initial load
  fetchNews();
});
