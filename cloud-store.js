(function () {
  const config = window.KPI_CLOUD_CONFIG || {};
  let timer = null;
  let pendingState = null;
  let pendingDirtyRecords = new Set();
  let waiters = [];

  function enabled() {
    return Boolean(config.supabaseUrl && config.anonKey);
  }

  function endpoint(query = '') {
    return `${config.supabaseUrl.replace(/\/$/, '')}/rest/v1/kpi_app_state${query}`;
  }

  function headers(extra = {}) {
    return {
      apikey: config.anonKey,
      Authorization: `Bearer ${config.anonKey}`,
      'Content-Type': 'application/json',
      ...extra
    };
  }

  async function load() {
    if (!enabled()) return null;
    const id = encodeURIComponent(config.recordId || 'kpi-general-affair');
    const response = await fetch(endpoint(`?id=eq.${id}&select=data`), { headers: headers() });
    if (!response.ok) throw new Error(`Cloud load gagal (${response.status})`);
    const rows = await response.json();
    return rows[0]?.data || null;
  }

  function normalizeStore(state) {
    return {
      version: state?.version || 2,
      selectedSppg: state?.selectedSppg,
      selectedPeriod: state?.selectedPeriod,
      records: state?.records || {}
    };
  }

  function mergeDirtyRecords(remoteState, localState, dirtyRecords = []) {
    const remote = normalizeStore(remoteState || {});
    const local = normalizeStore(localState || {});
    const merged = {
      ...remote,
      version: Math.max(Number(remote.version || 0), Number(local.version || 0), 2),
      selectedSppg: local.selectedSppg || remote.selectedSppg,
      selectedPeriod: local.selectedPeriod || remote.selectedPeriod,
      records: structuredClone(remote.records || {})
    };

    dirtyRecords.forEach(key => {
      const [sppg, period] = String(key).split('|||');
      if (!sppg || !period) return;
      const localRecord = local.records?.[sppg]?.[period];
      if (!localRecord) return;
      merged.records[sppg] ??= {};
      merged.records[sppg][period] = structuredClone(localRecord);
    });

    return merged;
  }

  async function persist(state) {
    const response = await fetch(endpoint('?on_conflict=id'), {
      method: 'POST',
      headers: headers({ Prefer: 'resolution=merge-duplicates,return=minimal' }),
      body: JSON.stringify({
        id: config.recordId || 'kpi-general-affair',
        data: state,
        updated_at: new Date().toISOString()
      })
    });
    if (!response.ok) throw new Error(`Cloud save gagal (${response.status})`);
  }

  async function saveMerged(state, dirtyRecords) {
    const remote = await load();
    const merged = dirtyRecords?.length ? mergeDirtyRecords(remote, state, dirtyRecords) : state;
    await persist(merged);
    return merged;
  }

  function flushPending() {
    const state = pendingState;
    const dirtyRecords = [...pendingDirtyRecords];
    const currentWaiters = waiters;
    pendingState = null;
    pendingDirtyRecords = new Set();
    waiters = [];
    saveMerged(state, dirtyRecords).then(result => {
      currentWaiters.forEach(({ resolve }) => resolve(result));
    }).catch(error => {
      currentWaiters.forEach(({ reject }) => reject(error));
    });
  }

  function save(state, options = {}) {
    if (!enabled()) return Promise.resolve(false);
    pendingState = structuredClone(state);
    (options.dirtyRecords || []).forEach(key => pendingDirtyRecords.add(key));
    clearTimeout(timer);
    return new Promise((resolve, reject) => {
      waiters.push({ resolve, reject });
      timer = setTimeout(async () => {
        flushPending();
      }, 120);
    });
  }

  window.KpiCloud = { enabled, load, save, persist, saveMerged };
})();
