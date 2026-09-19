(() => {
  const config = window.MAYUR_GALLERY_CONFIG || {};
  const supabaseLib = window.supabase;
  const loginPanel = document.getElementById('loginPanel');
  const dashboard = document.getElementById('dashboard');
  const loginForm = document.getElementById('loginForm');
  const galleryForm = document.getElementById('galleryForm');
  const loginMessage = document.getElementById('loginMessage');
  const dashboardMessage = document.getElementById('dashboardMessage');
  const itemsList = document.getElementById('itemsList');
  const itemCount = document.getElementById('itemCount');
  const cancelEditButton = document.getElementById('cancelEditButton');
  const formTitle = document.getElementById('formTitle');
  const saveButton = document.getElementById('saveButton');
  const contentTabs = document.querySelectorAll('[data-content-tab]');
  const contentEyebrow = document.getElementById('contentEyebrow');
  const itemsEyebrow = document.getElementById('itemsEyebrow');
  const itemsTitle = document.getElementById('itemsTitle');
  const galleryOnlyFields = document.querySelectorAll('.gallery-only-field');
  let client;
  let items = [];
  let activeTab = 'gallery';

  function message(element, text, success = false) {
    element.textContent = text;
    element.classList.toggle('success', success);
  }

  function escapeText(value) {
    return String(value ?? '').replace(/[&<>'"]/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));
  }

  function configured() {
    if (!supabaseLib || !config.supabaseUrl || !config.supabaseAnonKey) {
      message(loginMessage, 'Admin setup is incomplete. Add the Supabase URL and anon key to gallery-data.js.');
      return false;
    }
    return true;
  }

  async function sessionToken() {
    const { data } = await client.auth.getSession();
    return data.session?.access_token || '';
  }

  async function callImageFunction(name, body) {
    const token = await sessionToken();
    const response = await fetch(`${config.supabaseUrl.replace(/\/$/, '')}/functions/v1/${name}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, apikey: config.supabaseAnonKey },
      body
    });
    const result = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(result.error || 'Image service request failed');
    return result;
  }

  function resetForm() {
    galleryForm.reset();
    document.getElementById('itemId').value = '';
    document.getElementById('displayOrder').value = items.filter(item => item.category !== 'trainer').length;
    formTitle.textContent = activeTab === 'trainer' ? 'Add trainer photo' : 'Add image';
    saveButton.textContent = activeTab === 'trainer' ? 'Add trainer photo' : 'Add image';
    cancelEditButton.hidden = true;
  }

  function setActiveTab(tab) {
    activeTab = tab;
    contentTabs.forEach(button => {
      const isActive = button.dataset.contentTab === tab;
      button.classList.toggle('active', isActive);
      button.setAttribute('aria-selected', String(isActive));
    });
    const trainerMode = tab === 'trainer';
    contentEyebrow.textContent = trainerMode ? 'Trainer profile content' : 'Gallery content';
    itemsEyebrow.textContent = trainerMode ? 'Published and hidden trainer photos' : 'Published and hidden photos';
    itemsTitle.textContent = trainerMode ? 'Trainer photos' : 'Gallery items';
    galleryOnlyFields.forEach(field => { field.hidden = trainerMode; });
    document.getElementById('category').required = !trainerMode;
    document.getElementById('categoryLabel').required = !trainerMode;
    document.getElementById('displayOrder').required = !trainerMode;
    resetForm();
    renderItems();
  }

  function editItem(item) {
    document.getElementById('itemId').value = item.id;
    document.getElementById('title').value = item.title;
    document.getElementById('description').value = item.description || '';
    document.getElementById('altText').value = item.alt_text;
    document.getElementById('category').value = item.category;
    document.getElementById('categoryLabel').value = item.category_label;
    document.getElementById('displayOrder').value = item.display_order;
    document.getElementById('isPublished').checked = item.is_published;
    formTitle.textContent = activeTab === 'trainer' ? 'Edit trainer photo' : 'Edit image';
    saveButton.textContent = 'Save changes';
    cancelEditButton.hidden = false;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function renderItems() {
    const visibleItems = items.filter(item => activeTab === 'trainer' ? item.category === 'trainer' : item.category !== 'trainer');
    itemCount.textContent = visibleItems.length;
    if (!visibleItems.length) {
      itemsList.innerHTML = activeTab === 'trainer'
        ? '<p class="muted">No trainer photo yet. Add a profile photo using the form.</p>'
        : '<p class="muted">No gallery items yet. Add the first image using the form.</p>';
      return;
    }
    itemsList.innerHTML = visibleItems.map((item, index) => `<article class="item-row"><img src="${escapeText(item.thumbnail_url || item.image_url)}" alt=""><div><p class="item-title">${escapeText(item.title)}</p><p class="item-meta">${escapeText(item.category_label)}${activeTab === 'gallery' ? ` · order ${item.display_order}` : ''}</p><span class="status-pill ${item.is_published ? '' : 'hidden-status'}">${item.is_published ? 'Published' : 'Hidden'}</span></div><div class="item-actions">${activeTab === 'gallery' ? `<button class="mini-button" data-action="up" data-id="${item.id}" ${index === 0 ? 'disabled' : ''}>Up</button><button class="mini-button" data-action="down" data-id="${item.id}" ${index === visibleItems.length - 1 ? 'disabled' : ''}>Down</button>` : ''}<button class="mini-button" data-action="edit" data-id="${item.id}">Edit</button><button class="mini-button" data-action="toggle" data-id="${item.id}">${item.is_published ? 'Hide' : 'Publish'}</button><button class="mini-button danger" data-action="delete" data-id="${item.id}">Delete</button></div></article>`).join('');
  }

  async function loadItems() {
    message(dashboardMessage, 'Loading...');
    const { data, error } = await client.from('gallery_items').select('*').order('display_order', { ascending: true }).order('created_at', { ascending: false });
    if (error) throw error;
    items = data || [];
    renderItems();
    message(dashboardMessage, '', true);
  }

  async function showDashboard() {
    loginPanel.hidden = true;
    dashboard.hidden = false;
    try { await loadItems(); } catch (error) { message(dashboardMessage, error.message || 'Could not load gallery items.'); }
  }

  async function saveItem(event) {
    event.preventDefault();
    saveButton.disabled = true;
    message(dashboardMessage, 'Saving...');
    const id = document.getElementById('itemId').value;
    const file = document.getElementById('imageFile').files[0];
    let uploaded;
    try {
      if (!id && !file) throw new Error('Choose an image before adding a gallery item.');
      if (file) uploaded = await callImageFunction('imagekit-upload', (() => { const form = new FormData(); form.append('file', file); return form; })());
      const { data: { user } } = await client.auth.getUser();
      const values = {
        title: document.getElementById('title').value.trim(),
        description: document.getElementById('description').value.trim(),
        alt_text: document.getElementById('altText').value.trim(),
        category: activeTab === 'trainer' ? 'trainer' : document.getElementById('category').value.trim().toLowerCase().replace(/\s+/g, '-'),
        category_label: activeTab === 'trainer' ? 'Trainer' : document.getElementById('categoryLabel').value.trim(),
        display_order: activeTab === 'trainer' ? 0 : Number(document.getElementById('displayOrder').value),
        is_published: document.getElementById('isPublished').checked
      };
      if (uploaded) Object.assign(values, { image_url: uploaded.imageUrl, image_path: uploaded.imagePath, image_file_id: uploaded.imageFileId, thumbnail_url: uploaded.thumbnailUrl });
      if (!id) values.created_by = user.id;
      const result = id ? await client.from('gallery_items').update(values).eq('id', id) : await client.from('gallery_items').insert(values);
      if (result.error) {
        if (uploaded?.imageFileId) await callImageFunction('imagekit-delete', JSON.stringify({ fileId: uploaded.imageFileId })).catch(() => {});
        throw result.error;
      }
      const oldItem = items.find(item => item.id === id);
      if (id && uploaded?.imageFileId && oldItem?.image_file_id) await callImageFunction('imagekit-delete', JSON.stringify({ fileId: oldItem.image_file_id })).catch(() => {});
      resetForm();
      await loadItems();
      message(dashboardMessage, activeTab === 'trainer' ? 'Trainer photo saved.' : 'Gallery item saved.', true);
    } catch (error) { message(dashboardMessage, error.message || 'Could not save gallery item.'); }
    finally { saveButton.disabled = false; }
  }

  async function updateItem(item, changes) {
    const { error } = await client.from('gallery_items').update(changes).eq('id', item.id);
    if (error) throw error;
  }

  async function reorder(item, direction) {
    const index = items.findIndex(candidate => candidate.id === item.id);
    const other = items[index + direction];
    if (!other) return;
    await Promise.all([updateItem(item, { display_order: other.display_order }), updateItem(other, { display_order: item.display_order })]);
    await loadItems();
  }

  async function handleItemAction(event) {
    const button = event.target.closest('[data-action]');
    if (!button || button.disabled) return;
    const item = items.find(candidate => candidate.id === button.dataset.id);
    if (!item) return;
    try {
      message(dashboardMessage, 'Updating...');
      if (button.dataset.action === 'edit') editItem(item);
      if (button.dataset.action === 'toggle') await updateItem(item, { is_published: !item.is_published });
      if (button.dataset.action === 'up') await reorder(item, -1);
      if (button.dataset.action === 'down') await reorder(item, 1);
      if (button.dataset.action === 'delete') {
        if (!window.confirm(`Are you sure you want to delete “${item.title}”?`)) return;
        const { error } = await client.from('gallery_items').delete().eq('id', item.id);
        if (error) throw error;
        if (item.image_file_id) await callImageFunction('imagekit-delete', JSON.stringify({ fileId: item.image_file_id })).catch(() => {});
        await loadItems();
      }
      if (button.dataset.action === 'toggle') await loadItems();
      message(dashboardMessage, 'Updated.', true);
    } catch (error) { message(dashboardMessage, error.message || 'Could not update item.'); }
  }

  async function init() {
    if (!configured()) return;
    client = supabaseLib.createClient(config.supabaseUrl, config.supabaseAnonKey);
    client.auth.onAuthStateChange((_event, session) => { if (session) showDashboard(); else { loginPanel.hidden = false; dashboard.hidden = true; } });
    const { data } = await client.auth.getSession();
    if (data.session) await showDashboard();
  }

  loginForm.addEventListener('submit', async event => {
    event.preventDefault();
    if (!client) return;
    message(loginMessage, 'Signing in...');
    const { error } = await client.auth.signInWithPassword({ email: document.getElementById('loginEmail').value, password: document.getElementById('loginPassword').value });
    if (error) message(loginMessage, error.message); else message(loginMessage, '', true);
  });
  galleryForm.addEventListener('submit', saveItem);
  itemsList.addEventListener('click', handleItemAction);
  contentTabs.forEach(button => button.addEventListener('click', () => setActiveTab(button.dataset.contentTab)));
  cancelEditButton.addEventListener('click', resetForm);
  document.getElementById('logoutButton').addEventListener('click', () => client?.auth.signOut());
  init();
})();
