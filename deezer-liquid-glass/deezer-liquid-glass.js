// ==UserScript==
// @name         Deezer Liquid Glass
// @namespace    https://github.com/BateauTigre
// @version      1.9.0
// @description  Thème Liquid Glass (blanc / noir) pour Deezer web : verre, lumière qui suit la souris, plein écran sur la pochette.
// @author       BateauTigre (Arthur Goubill)
// @credits      Design et code réalisés avec l'aide de Claude (Anthropic). Police Geist par Vercel (SIL OFL). Non affilié à Deezer.
// @match        https://www.deezer.com/*
// @run-at       document-start
// @grant        none
// ==/UserScript==

(function () {
  'use strict';
  if (window.__lgLoaded) return;
  window.__lgLoaded = true;

  /* ---------- Réglages (gardés dans le navigateur) ---------- */
  const KEY = 'lg-settings';
  const DEFAULTS = { theme: 'noir', im: 'cover', preset: 1, color: '#1d3557', frost: 30, clean: true };
  let S = Object.assign({}, DEFAULTS);
  try { Object.assign(S, JSON.parse(localStorage.getItem(KEY) || '{}')); } catch (e) {}
  if (typeof S.frost !== 'number') S.frost = 30;
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) {} };

  // Sections gardées sur l'accueil quand « Accueil épuré » est activé
  const KEEP = ['Écouté récemment', 'Playlists suivies', 'Flow', 'En boucle chez toi'];

  const PRESETS = [
    { name: 'Brume', bg: 'linear-gradient(160deg, #e4e9f1 0%, #b7c3d8 100%)' },
    { name: 'Abysse', bg: 'radial-gradient(circle at 50% 30%, #14305c 0%, #000 70%)' },
    { name: 'Aurore', bg: 'linear-gradient(150deg, #f6d2bd 0%, #cfc2ef 100%)' },
    { name: 'Forêt', bg: 'radial-gradient(circle at 40% 30%, #1d4a3a 0%, #030a07 75%)' }
  ];

  /* ---------- Thèmes ---------- */
  const TH = {
    noir: {
      page: '#000000', scrim: 'rgba(0,0,0,0.50)', surface: 'rgba(22,22,28,0.84)',
      fill1: 'rgba(255,255,255,0.06)', fill2: 'rgba(255,255,255,0.10)', fill3: 'rgba(255,255,255,0.16)',
      text: '#F4F5F7', text2: 'rgba(244,245,247,0.70)', line: 'rgba(255,255,255,0.12)', line2: 'rgba(255,255,255,0.22)',
      primary: '#F4F5F7', onprimary: '#000000', accent: '#7EE0FF',
      glass: 'rgba(255,255,255,0.06)', gb: 'rgba(255,255,255,0.14)', ghi: 'rgba(255,255,255,0.22)',
      shadow: '0 30px 80px rgba(0,0,0,0.55)', edge: 'rgba(255,255,255,0.95)', sheen: 'rgba(255,255,255,0.07)',
      light: 'rgba(255,255,255,0.09)', imScrim: 'rgba(0,0,0,0.25)', pop: 'rgba(26,26,32,0.94)', pops: 'rgb(26,26,32)', danger: '#FF7B7B', tint: 'rgb(12,12,16)', bar: 'rgba(14,14,18,0.66)', track: 'rgba(255,255,255,0.16)'
    },
    blanc: {
      page: '#E9ECF1', scrim: 'rgba(236,239,244,0.68)', surface: 'rgba(250,251,253,0.88)',
      fill1: 'rgba(255,255,255,0.45)', fill2: 'rgba(255,255,255,0.66)', fill3: 'rgba(255,255,255,0.86)',
      text: '#121419', text2: 'rgba(18,20,25,0.68)', line: 'rgba(18,20,25,0.10)', line2: 'rgba(18,20,25,0.20)',
      primary: '#121419', onprimary: '#FFFFFF', accent: '#0870A8',
      glass: 'rgba(255,255,255,0.50)', gb: 'rgba(255,255,255,0.78)', ghi: 'rgba(255,255,255,0.95)',
      shadow: '0 24px 60px rgba(40,50,80,0.16)', edge: '#FFFFFF', sheen: 'rgba(255,255,255,0.30)',
      light: 'rgba(255,255,255,0.35)', imScrim: 'rgba(255,255,255,0.12)', pop: 'rgba(252,252,254,0.95)', pops: 'rgb(252,252,254)', danger: '#C62828', tint: 'rgb(255,255,255)', bar: 'rgba(255,255,255,0.68)', track: 'rgba(18,20,25,0.12)'
    }
  };

  // Variables de Deezer remplacées par celles du thème
  const deezerVars = (T) => {
    const v = {};
    const st = ['default', 'hovered', 'pressed', 'selected', 'disabled', 'focused'];
    const all = (base, val) => st.forEach((s) => { v[base + '-' + s] = val; });
    Object.assign(v, {
      '--background-primary': T.surface, '--background-secondary': T.fill1, '--background-intermediate': T.fill2,
      '--background-contrast': T.fill2, '--color-bg-main': T.surface, '--color-bg-secondary': T.fill1,
      '--color-bg-tertiary': T.fill2, '--color-bg-tertiary-hover': T.fill3, '--color-bg-contrast': T.fill2,
      '--text-primary': T.text, '--text-intermediate': T.text, '--color-text-main': T.text,
      '--color-text-secondary': T.text2, '--divider-primary': T.line, '--divider-secondary': T.line,
      '--color-border-neutral-primary': T.line, '--color-border-neutral-secondary': T.line,
      '--color-accent': T.primary, '--color-accent-main': T.primary, '--color-accent-strong': T.primary,
      '--tempo-colors-comp-cover-border': T.line
    });
    all('--tempo-colors-background-neutral-primary', T.fill2);
    v['--tempo-colors-background-neutral-primary-default'] = T.surface;
    all('--tempo-colors-background-neutral-secondary', T.fill2);
    v['--tempo-colors-background-neutral-secondary-default'] = T.fill1;
    all('--tempo-colors-background-neutral-tertiary', T.fill3);
    v['--tempo-colors-background-neutral-tertiary-default'] = T.fill2;
    all('--tempo-colors-background-neutral-inverse', T.primary);
    all('--tempo-colors-background-accent-primary', T.primary);
    all('--tempo-colors-text-neutral-primary', T.text);
    all('--tempo-colors-text-neutral-secondary', T.text2);
    all('--tempo-colors-text-neutral-inverse', T.onprimary);
    all('--tempo-colors-text-accent-primary', T.accent);
    all('--tempo-colors-text-accent-onAccent', T.onprimary);
    all('--tempo-colors-icon-neutral-primary', T.text);
    all('--tempo-colors-icon-neutral-secondary', T.text2);
    all('--tempo-colors-icon-neutral-tertiary', T.text2);
    all('--tempo-colors-icon-neutral-inverse', T.onprimary);
    all('--tempo-colors-icon-accent-primary', T.accent);
    all('--tempo-colors-icon-accent-onAccent', T.onprimary);
    all('--tempo-colors-border-neutral-primary', T.line);
    v['--tempo-colors-border-neutral-primary-hovered'] = T.line2;
    v['--tempo-colors-border-neutral-primary-focused'] = T.accent;
    all('--tempo-colors-divider-neutral-primary', T.line);
    // Variables du thème
    Object.assign(v, {
      '--lg-page': T.page, '--lg-scrim': T.scrim, '--lg-text': T.text, '--lg-text2': T.text2,
      '--lg-glass': T.glass, '--lg-gb': T.gb, '--lg-ghi': T.ghi, '--lg-shadow': T.shadow,
      '--lg-primary': T.primary, '--lg-onprimary': T.onprimary, '--lg-ctrl': T.fill2, '--lg-accent': T.accent,
      '--lg-edge': T.edge, '--lg-sheen': T.sheen, '--lg-light': T.light, '--lg-imscrim': T.imScrim,
      '--lg-surface': T.surface, '--lg-line': T.line, '--lg-line2': T.line2, '--lg-pop': T.pop, '--lg-bar': T.bar, '--lg-pops': T.pops, '--lg-danger': T.danger, '--lg-tint': T.tint, '--lg-track': T.track
    });
    return Object.entries(v).map(([k, val]) => k + ':' + val + ' !important').join(';');
  };

  /* ---------- Icônes maison (duotone) ---------- */
  const ic = (inner) => 'url("data:image/svg+xml,' + encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="#000" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">' + inner + '</svg>') + '")';
  // Jeu A : plein arrondi
  const F = 'fill="#000" stroke="none"';
  const HEART = 'M12 20.3c-.3 0-.6-.1-.8-.3C6.6 16.4 3 13.3 3 9.3 3 6.6 5.1 4.5 7.7 4.5c1.7 0 3.2.9 4.3 2.3 1.1-1.4 2.6-2.3 4.3-2.3 2.6 0 4.7 2.1 4.7 4.8 0 4-3.6 7.1-8.2 10.7-.2.2-.5.3-.8.3z';
  const SPEAKER = '<path d="M11.6 4.4 7 8.5H4.5A1.5 1.5 0 0 0 3 10v4a1.5 1.5 0 0 0 1.5 1.5H7l4.6 4.1c.6.6 1.6.1 1.6-.7V5.1c0-.8-1-1.3-1.6-.7z" ' + F + '/>';
  const ICONS = [
    ['[data-testid^="House"]', ic('<path d="M3.5 10.6 11 4.4a1.6 1.6 0 0 1 2 0l7.5 6.2c.3.3.5.7.5 1.1V19a1.5 1.5 0 0 1-1.5 1.5H15V15a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v5.5H4.5A1.5 1.5 0 0 1 3 19v-7.3c0-.4.2-.8.5-1.1z" ' + F + '/>')],
    ['[data-testid^="Compass"]', ic('<path fill-rule="evenodd" d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm3.6 5.4-2 5.2-5.2 2 2-5.2z" ' + F + '/>')],
    ['[data-testid="HeartOutlinedIcon"]', ic('<path d="M12 19.6C7.3 16 4.1 13.2 4.1 9.4c0-2.2 1.7-3.8 3.7-3.8 1.6 0 3 .9 4.2 2.6 1.2-1.7 2.6-2.6 4.2-2.6 2 0 3.7 1.6 3.7 3.8 0 3.8-3.2 6.6-7.9 10.2z" stroke-width="2"/>')],
    ['[data-testid="HeartFilledIcon"]', ic('<path d="' + HEART + '" ' + F + '/>')],
    ['[data-testid="SquareSplitIcon"]', ic('<path d="M4 6h11M4 11h11M4 16h6M19.3 17.5V8.3l2.2.7"/><circle cx="17" cy="17.5" r="2.7" ' + F + '/>')],
    ['[data-testid="AlbumIcon"]', ic('<path fill-rule="evenodd" d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm0 6.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z" ' + F + '/>')],
    ['[data-testid^="Human"]', ic('<circle cx="12" cy="8" r="4" ' + F + '/><path d="M4.5 20c0-3.6 3.4-6 7.5-6s7.5 2.4 7.5 6c0 .6-.4 1-1 1h-13c-.6 0-1-.4-1-1z" ' + F + '/>')],
    ['[data-testid^="MicrophoneShow"]', ic('<rect x="8.5" y="2.5" width="7" height="12" rx="3.5" ' + F + '/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"/>')],
    ['[data-testid="MicrophoneIcon"]', ic('<path d="M5 4h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-6.5l-4.3 3.4c-.6.5-1.5 0-1.5-.8V17H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" ' + F + '/>')],
    ['[data-testid^="PlayFilled"],[data-testid^="PlayOutlined"]', ic('<path d="M7 5.3v13.4c0 1 1.1 1.6 1.9 1.1l10.4-6.7c.8-.5.8-1.7 0-2.2L8.9 4.2C8.1 3.7 7 4.3 7 5.3z" ' + F + '/>')],
    ['[data-testid^="Pause"]', ic('<rect x="6" y="4.5" width="4.2" height="15" rx="1.6" ' + F + '/><rect x="13.8" y="4.5" width="4.2" height="15" rx="1.6" ' + F + '/>')],
    ['[data-testid^="SkipBackward"]', ic('<path d="M11.5 7.2v9.6c0 .8-.9 1.3-1.6.8L3.4 12.8a1 1 0 0 1 0-1.6l6.5-4.8c.7-.5 1.6 0 1.6.8zM20.5 7.2v9.6c0 .8-.9 1.3-1.6.8l-6.5-4.8a1 1 0 0 1 0-1.6l6.5-4.8c.7-.5 1.6 0 1.6.8z" ' + F + '/>')],
    ['[data-testid^="SkipForward"]', ic('<path d="M3.5 7.2v9.6c0 .8.9 1.3 1.6.8l6.5-4.8a1 1 0 0 0 0-1.6L5.1 6.4c-.7-.5-1.6 0-1.6.8zM12.5 7.2v9.6c0 .8.9 1.3 1.6.8l6.5-4.8a1 1 0 0 0 0-1.6l-6.5-4.8c-.7-.5-1.6 0-1.6.8z" ' + F + '/>')],
    ['[data-testid^="Shuffle"]', ic('<path d="M3 7h3.5c1.4 0 2.6.7 3.4 1.8l4.2 6.4c.8 1.1 2 1.8 3.4 1.8H21M18 14l3 3-3 3M3 17h3.5c1 0 2-.4 2.7-1.1M21 7h-3.5c-1 0-2 .4-2.7 1.1M18 4l3 3-3 3"/>')],
    ['[data-testid^="Repeat"]', ic('<path d="M17 2.5 20.5 6 17 9.5M3.5 11V9.5A3.5 3.5 0 0 1 7 6h13.5M7 21.5 3.5 18 7 14.5M20.5 13v1.5A3.5 3.5 0 0 1 17 18H3.5"/>')],
    ['[data-testid="QueueIcon"]', ic('<path d="M4 6h16M4 11.5h16M4 17h8"/><path d="M15.5 14.6v5.3c0 .5.5.8.9.5l3.7-2.6a.6.6 0 0 0 0-1l-3.7-2.7c-.4-.3-.9 0-.9.5z" ' + F + '/>')],
    ['[data-testid^="Volume"]', ic(SPEAKER + '<path d="M16 9a4.2 4.2 0 0 1 0 6M18.8 6.3a8 8 0 0 1 0 11.4"/>')],
    ['[data-testid*="Mute"],[data-testid*="VolumeOff"],[data-testid*="VolumeMin"]', ic(SPEAKER + '<path d="M16.5 9.5l5 5M21.5 9.5l-5 5"/>')],
    ['[data-testid="SlidersIcon"]', ic('<path d="M4 7h9M19 7h1M4 17h3M13 17h7"/><circle cx="16" cy="7" r="2.6" ' + F + '/><circle cx="10" cy="17" r="2.6" ' + F + '/>')],
    ['[data-testid="PlusIcon"]', ic('<path d="M12 5v14M5 12h14" stroke-width="2.4"/>')]
  ];
  const iconCSS = ICONS.map(([sel, url]) => {
    const s = sel.split(',').map((x) => 'svg' + x.trim()).join(',');
    const kids = sel.split(',').map((x) => 'svg' + x.trim() + ' > *').join(',');
    return s + '{background:currentColor !important;-webkit-mask:' + url + ' center/100% 100% no-repeat;mask:' + url + ' center/100% 100% no-repeat}' + kids + '{display:none !important}';
  }).join('\n');

  /* ---------- Styles ---------- */
  const CSS = `
@import url("https://fonts.googleapis.com/css2?family=Geist:wght@400;500;600&display=swap");
html[data-lg-theme="noir"], html[data-lg-theme="noir"] body, html[data-lg-theme="noir"] [data-theme], html[data-lg-theme="noir"] .chakra-ui-light, html[data-lg-theme="noir"] .chakra-ui-dark { ${deezerVars(TH.noir)}; color-scheme: dark !important }
html[data-lg-theme="blanc"], html[data-lg-theme="blanc"] body, html[data-lg-theme="blanc"] [data-theme], html[data-lg-theme="blanc"] .chakra-ui-light, html[data-lg-theme="blanc"] .chakra-ui-dark { ${deezerVars(TH.blanc)}; color-scheme: light !important }
html[data-lg-theme] { background: var(--lg-page) !important; transition: background-color .5s }
html[data-lg-theme] body, html[data-lg-theme] #dzr-app, html[data-lg-theme] .naboo, html[data-lg-theme] #page_content, html[data-lg-theme] #page_content > *, html[data-lg-theme] .channel { background: transparent !important }
html[data-lg-theme] body, html[data-lg-theme] button, html[data-lg-theme] input { font-family: Geist, Inter, Arial, sans-serif !important }
html[data-lg-theme] ::selection { background: var(--lg-accent); color: var(--lg-onprimary) }

/* Fond : pochette floutée + voile + lumière du curseur */
#lg-bg, #lg-custom, #lg-scrim, #lg-light { position: fixed; pointer-events: none; z-index: -1 }
#lg-bg { left: 50%; top: 50%; width: 192px; height: 120px; margin: -60px 0 0 -96px; background: var(--lg-page) center/cover no-repeat; filter: blur(6px) saturate(160%); transform: scale(var(--lg-bgs, 14)); will-change: transform; transition: background-image .8s }
#lg-scrim { inset: 0; background: var(--lg-scrim); transition: background-color .5s }
#lg-custom { inset: 0; opacity: 0; transition: opacity .6s }
html[data-lg-bg="custom"] #lg-custom { opacity: 1 }
html[data-lg-bg="custom"] #lg-bg { visibility: hidden }
#lg-light { left: 0; top: 0; width: 840px; height: 840px; border-radius: 50%; background: radial-gradient(closest-side, var(--lg-light), transparent 100%); will-change: transform; transform: translate3d(-2000px, -2000px, 0) }

/* Panneaux en verre */
.lg-glass { background: color-mix(in srgb, var(--lg-tint) var(--lg-frost, 30%), var(--lg-glass)) !important; border: 1px solid var(--lg-gb) !important; box-shadow: inset 0 1px 0 var(--lg-ghi), var(--lg-shadow) !important; -webkit-backdrop-filter: blur(var(--lg-blur, 24px)) saturate(140%) !important; backdrop-filter: blur(var(--lg-blur, 24px)) saturate(140%) !important; isolation: isolate; transition: background-color .4s, border-color .4s }
.lg-edge { position: absolute; inset: 0; border-radius: inherit; pointer-events: none; overflow: hidden; z-index: -1; opacity: 0; transition: opacity .3s; contain: layout paint }
.lg-edge .lg-sheen { position: absolute; left: 0; top: 0; width: 560px; height: 560px; border-radius: 50%; background: radial-gradient(closest-side, var(--lg-sheen), transparent) }
.lg-edge .lg-ring { position: absolute; inset: 0; border-radius: inherit; padding: 1.5px; overflow: hidden; -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); -webkit-mask-composite: xor; mask-composite: exclude }
.lg-edge .lg-spot { position: absolute; left: 0; top: 0; width: 400px; height: 400px; border-radius: 50%; background: radial-gradient(closest-side, var(--lg-edge), transparent) }
.lg-edge.on .lg-sheen, .lg-edge.on .lg-spot { will-change: transform }

/* Barre latérale flottante */
.lg-side { top: 12px !important; left: 12px !important; width: calc(var(--lg-sw, 243px) - 24px) !important; height: calc(100vh - 81px - 36px) !important; border-radius: 28px !important; overflow: hidden; padding-bottom: 0 !important; display: flex !important; flex-direction: column !important; transition: width .25s, height .25s, border-radius .25s }
/* Barre réduite : seulement un bouton rond pour la rouvrir */
html[data-lg-collapsed] .lg-side { top: 16px !important; left: 16px !important; width: 48px !important; height: 48px !important; padding: 0 !important; border-radius: 999px !important; align-items: center !important; justify-content: center !important }
html[data-lg-collapsed] .lg-side > *:not(.lg-edge):not(.lg-reopen) { display: none !important }
.lg-reopen { display: none }
html[data-lg-collapsed] .lg-side > .lg-reopen { display: flex; flex: 0 0 auto; width: 46px; height: 46px; align-items: center; justify-content: center; padding: 0; border: 0; border-radius: 999px; background: transparent; color: var(--lg-text); cursor: pointer; transition: background-color .2s }
html[data-lg-collapsed] .lg-side > .lg-reopen:hover { background: var(--lg-ctrl) }
.lg-side > .lg-side-scroll { flex: 1 1 auto !important; height: auto !important; min-height: 0 !important; max-height: none !important }

/* Barre du haut et recherche */
#page_topbar { background: transparent !important; box-shadow: none !important; border: 0 !important }
[data-testid="search_container"] input { height: 48px !important; border-radius: 999px !important; background: var(--lg-glass) !important; border: 1px solid var(--lg-gb) !important; box-shadow: inset 0 1px 0 var(--lg-ghi) !important; -webkit-backdrop-filter: blur(var(--lg-blur, 24px)) saturate(140%); backdrop-filter: blur(var(--lg-blur, 24px)) saturate(140%); color: var(--lg-text) !important }
[data-testid="search_container"] input::placeholder { color: var(--lg-text2) !important }

/* Lecteur flottant */
.lg-player { left: 12px !important; right: 12px !important; bottom: 12px !important; width: auto !important; border-radius: 28px !important }
.lg-player [data-testid="item_cover"] { cursor: zoom-in; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 20px rgba(0,0,0,.3); transition: transform .25s }
.lg-player [data-testid="item_cover"]:hover { transform: scale(1.06) }
.lg-player [role="group"]:has(> button[data-testid^="play_button"]) { align-items: center !important; gap: 6px }
.lg-player [role="group"]:has(> button[data-testid^="play_button"]) > div { display: flex !important; align-items: center !important }
.lg-player button[data-testid^="play_button"] { width: 46px !important; height: 46px !important; min-width: 46px !important; margin: -7px 4px !important; border-radius: 999px !important; background: var(--lg-primary) !important; color: var(--lg-onprimary) !important; box-shadow: 0 10px 24px rgba(0,0,0,.28) !important; transition: transform .2s }
.lg-player button[data-testid^="play_button"]:hover { transform: scale(1.06) }
.lg-player button[data-testid^="play_button"] svg { color: var(--lg-onprimary) !important }
.lg-player button[data-testid$="_on"] svg, .lg-player button[data-testid="add_to_favorite_button_on"] svg { color: var(--lg-accent) !important }
.lg-player input[data-testid="progress_bar"] { accent-color: var(--lg-primary) }
html[data-lg-theme] #page_content { padding-bottom: 24px }

/* Accueil épuré */
html[data-lg-clean] .lg-hide { display: none !important }


/* Lecteur redessiné */
html[data-lg-theme] .lg-player.lg-glass { background: color-mix(in srgb, var(--lg-tint) var(--lg-frost, 30%), var(--lg-bar)) !important; -webkit-backdrop-filter: blur(calc(var(--lg-blur, 24px) + 8px)) saturate(150%) !important; backdrop-filter: blur(calc(var(--lg-blur, 24px) + 8px)) saturate(150%) !important }
.lg-player [data-testid="item_title"] { font-size: 15px !important; font-weight: 600 !important; letter-spacing: -0.01em }
.lg-player [data-testid="item_subtitle"], .lg-player [data-testid="item_subtitle"] * { font-size: 13px !important; color: var(--lg-text2) !important }
.lg-player [data-testid="elapsed_time"], .lg-player [data-testid="remaining_time"] { font-size: 12px !important; color: var(--lg-text2) !important; font-variant-numeric: tabular-nums }
.lg-player .slider-track { height: 5px !important; border-radius: 99px }
.lg-player .slider-track-default, .lg-player .slider-track-active { top: 0 !important; height: 5px !important; border-radius: 99px !important }
.lg-player .slider-track-default { background: var(--lg-track) !important }
.lg-player .slider-track-active { background: var(--lg-primary) !important; position: relative }
.lg-player .slider-track-active::after { content: ""; position: absolute; right: -6px; top: 50%; width: 13px; height: 13px; margin-top: -6.5px; border-radius: 50%; background: var(--lg-primary); box-shadow: 0 2px 8px rgba(0,0,0,.35); transform: scale(0); transition: transform .18s }
.lg-player .slider:hover .slider-track-active::after { transform: scale(1) }
.lg-player [role="group"] button:not([data-testid^="play_button"]) { color: var(--lg-text2) !important; border-radius: 999px !important; transition: color .2s, background-color .2s }
.lg-player [role="group"] button:not([data-testid^="play_button"]):hover { color: var(--lg-text) !important; background: var(--lg-ctrl) !important }
.lg-player button[data-testid$="_on"], .lg-player button[data-testid="add_to_favorite_button_on"], .lg-player button[data-testid^="repeat_button_all"], .lg-player button[data-testid^="repeat_button_single"] { color: var(--lg-accent) !important }

/* Bas de l'écran assombri : rien ne dépasse sous le lecteur */
#lg-fade { position: fixed; left: 0; right: 0; bottom: 0; height: 190px; z-index: 1; pointer-events: none; background: linear-gradient(to top, var(--lg-page) 0%, color-mix(in srgb, var(--lg-page) 82%, transparent) 45%, transparent 100%) }

/* File d'attente et paroles plein écran : vrai fond */
html[data-lg-theme] .player-full { background: var(--lg-pop) !important; bottom: 0 !important }
html[data-lg-theme] .player-full .player-container { bottom: 112px !important }

/* Pas de petites flèches (losanges) sous les menus et infobulles */
.chakra-popover__arrow-positioner, .chakra-popover__arrow, .chakra-tooltip__arrow-wrapper, .chakra-tooltip__arrow, [data-popper-arrow] { display: none !important }

/* Notifications : bouton Tout marquer comme lu */
.popper-notifications > h2 { display: flex !important; align-items: center; justify-content: space-between; gap: 12px }
.lg-readall { flex: 0 0 auto; height: 34px; padding: 0 12px 0 10px; border-radius: 999px; border: 1px solid var(--lg-gb); background: var(--lg-ctrl); color: var(--lg-text); font: 500 13px Geist, Inter, Arial, sans-serif; letter-spacing: 0; display: inline-flex; align-items: center; gap: 6px; cursor: pointer; transition: background-color .2s, opacity .2s }
.lg-readall:hover { background: var(--lg-line2) }
.lg-readall[disabled] { opacity: .6; cursor: default }
html[data-lg-notif-clear] .lg-notif-badge { display: none !important }
html[data-lg-notif-clear] .notifications-item h2 > span:first-child:empty { display: none !important }

/* Menus « … » et sous-menus : panneaux opaques, options transparentes */
html[data-lg-theme] .chakra-popover__content > div, html[data-lg-theme] .chakra-popover__content > div > div { background-color: var(--lg-pops) !important }
html[data-lg-theme] .chakra-popover__content button.chakra-stack, html[data-lg-theme] .chakra-popover__content [role="menuitem"], html[data-lg-theme] .chakra-menu__menuitem { background: transparent !important; border-radius: 12px !important; transition: background-color .15s }
html[data-lg-theme] .chakra-popover__content button.chakra-stack:hover, html[data-lg-theme] .chakra-popover__content button.chakra-stack:focus-visible, html[data-lg-theme] .chakra-popover__content [role="menuitem"]:hover, html[data-lg-theme] .chakra-menu__menuitem:hover { background: var(--lg-ctrl) !important }

/* Menus « … » redessinés : compacts, regroupés, action destructive en rouge */
html[data-lg-theme] .chakra-popover__content:has(ul > li > button.chakra-stack) { border-radius: 18px !important; background: var(--lg-pops) !important; border: 1px solid var(--lg-gb) !important; box-shadow: inset 0 1px 0 var(--lg-ghi), 0 0 0 .5px rgba(0,0,0,.35), 0 18px 50px rgba(0,0,0,.45) !important }
html[data-lg-theme] .chakra-popover__content:has(ul > li > button.chakra-stack) > div { border-radius: 16px !important; overflow: hidden !important }
html[data-lg-theme] .chakra-popover__content:has(ul > li > button.chakra-stack) [style*="overflow: auto"] { overscroll-behavior: contain }
html[data-lg-theme] .chakra-popover__content:has(ul > li > button.chakra-stack) ul { padding: 0 !important; margin: 0 !important }
html[data-lg-theme] .chakra-popover__content:has(ul > li > button.chakra-stack) li { list-style: none }
html[data-lg-theme] .chakra-popover__content:has(ul > li > button.chakra-stack) button.chakra-stack { height: 40px !important; min-height: 40px !important; padding: 0 12px !important; gap: 12px !important; border-radius: 12px !important; font-size: 15px !important; font-weight: 500 !important; letter-spacing: -0.005em; color: var(--lg-text) !important; background: transparent !important }
html[data-lg-theme] .chakra-popover__content:has(ul > li > button.chakra-stack) button.chakra-stack * { font-size: 15px !important; font-weight: 500 !important }
html[data-lg-theme] .chakra-popover__content:has(ul > li > button.chakra-stack) li[style*="position: absolute"] > button.chakra-stack { height: 44px !important; min-height: 44px !important }
html[data-lg-theme] .chakra-popover__content:has(ul > li > button.chakra-stack) button.chakra-stack svg { width: 20px !important; height: 20px !important; flex: 0 0 20px !important; color: var(--lg-text2) !important; transition: color .15s }
html[data-lg-theme] .chakra-popover__content:has(ul > li > button.chakra-stack) button.chakra-stack:hover, html[data-lg-theme] .chakra-popover__content:has(ul > li > button.chakra-stack) button.chakra-stack:focus-visible { background: var(--lg-ctrl) !important }
html[data-lg-theme] .chakra-popover__content:has(ul > li > button.chakra-stack) button.chakra-stack:hover svg { color: var(--lg-text) !important }
html[data-lg-theme] .chakra-popover__content:has(ul > li > button.chakra-stack) button.chakra-stack svg[data-testid="ChevronRightIcon"] { width: 16px !important; height: 16px !important; flex-basis: 16px !important; margin-left: auto !important; opacity: .7 }
html[data-lg-theme] .chakra-popover__content:has(ul > li > button.chakra-stack) li:has(> button svg[data-testid^="Heart"]), html[data-lg-theme] .chakra-popover__content:has(ul > li > button.chakra-stack) li:has(> button svg[data-testid="CrossIcon"]), html[data-lg-theme] .chakra-popover__content:has(ul > li > button.chakra-stack) li:has(> button svg[data-testid="ShareIcon"]), html[data-lg-theme] .chakra-popover__content:has(ul > li > button.chakra-stack) li:has(> button svg[data-testid="SmsIcon"]) { margin-top: 6px !important; padding-top: 6px !important; border-top: 1px solid var(--lg-line) !important }
html[data-lg-theme] .chakra-popover__content:has(ul > li > button.chakra-stack) li:has(> button svg[data-testid*="Trash"]) button, html[data-lg-theme] .chakra-popover__content:has(ul > li > button.chakra-stack) li:has(> button svg[data-testid*="Trash"]) button svg, html[data-lg-theme] .chakra-popover__content:has(ul > li > button.chakra-stack) li:has(> button svg[data-testid*="Delete"]) button, html[data-lg-theme] .chakra-popover__content:has(ul > li > button.chakra-stack) li:has(> button svg[data-testid*="Delete"]) button svg { color: var(--lg-danger) !important }
html[data-lg-theme] .chakra-popover__content:has(ul > li > button.chakra-stack) button.chakra-stack:has(> svg[data-testid="ChevronLeftIcon"]) { height: 34px !important; padding: 0 8px !important; color: var(--lg-text2) !important; font-size: 13px !important }
html[data-lg-theme] .chakra-popover__content:has(ul > li > button.chakra-stack) button.chakra-stack:has(> svg[data-testid="ChevronLeftIcon"]) * { font-size: 13px !important; font-weight: 600 !important }
html[data-lg-theme] .chakra-popover__content:has(ul > li > button.chakra-stack) input { height: 38px !important; border-radius: 10px !important; background: var(--lg-ctrl) !important; border: 1px solid var(--lg-line) !important; color: var(--lg-text) !important; font-size: 14px !important }

/* Barres de défilement fines et discrètes */
html[data-lg-theme], html[data-lg-theme] * { scrollbar-width: auto !important; scrollbar-color: auto !important }
html[data-lg-theme] ::-webkit-scrollbar { width: 10px; height: 10px; background: transparent }
html[data-lg-theme] ::-webkit-scrollbar-track, html[data-lg-theme] ::-webkit-scrollbar-corner { background: transparent }
html[data-lg-theme] ::-webkit-scrollbar-thumb { background: var(--lg-line2); border-radius: 99px; border: 3px solid transparent; background-clip: content-box; min-height: 40px }
html[data-lg-theme] ::-webkit-scrollbar-thumb:hover { background: var(--lg-text2); border: 3px solid transparent; background-clip: content-box }
html[data-lg-theme] ::-webkit-scrollbar-button { display: none; width: 0; height: 0 }

/* Cases à cocher */
html[data-lg-theme] .chakra-checkbox__control { border-color: var(--lg-text2) !important; background: transparent !important }
html[data-lg-theme] .chakra-checkbox__control[data-checked] { background: var(--lg-primary) !important; border-color: var(--lg-primary) !important; color: var(--lg-onprimary) !important }

/* Menus et réglages de Deezer : lisibles et décollés du lecteur */
html[data-lg-theme] .chakra-popover__content { overflow: hidden }
html[data-lg-theme] .chakra-popover__content, html[data-lg-theme] .chakra-menu__menu-list, html[data-lg-theme] .chakra-modal__content { background: var(--lg-pops) !important; border: 1px solid var(--lg-gb) !important; border-radius: 22px !important; box-shadow: inset 0 1px 0 var(--lg-ghi), 0 24px 60px rgba(0,0,0,.35) !important; color: var(--lg-text) !important }
html[data-lg-theme] .chakra-popover__popper[data-popper-placement^="top"] > .chakra-popover__content { margin-bottom: 40px !important }
html[data-lg-theme] .chakra-radio__control { border: 2px solid var(--lg-text2) !important; background: transparent !important; color: var(--lg-primary) !important }
html[data-lg-theme] .chakra-radio__control[data-checked] { border-color: var(--lg-primary) !important; background: transparent !important }
html[data-lg-theme] .chakra-radio__control[data-checked]::before { background: var(--lg-primary) !important }
html[data-lg-theme] .chakra-switch__track { background: var(--lg-line2) !important }
html[data-lg-theme] .chakra-switch__track[data-checked] { background: var(--lg-primary) !important }
html[data-lg-theme] .chakra-switch__thumb { background: #fff !important; box-shadow: 0 1px 3px rgba(0,0,0,.35) !important }
html[data-lg-theme] .chakra-switch__track[data-checked] .chakra-switch__thumb { background: var(--lg-onprimary) !important }

/* Bouton Apparence */
#lg-fab { position: relative; width: 40px; height: 40px; margin-right: 12px; border-radius: 999px; display: inline-flex; align-items: center; justify-content: center; color: var(--lg-text); cursor: pointer; padding: 0; flex: 0 0 auto }
#lg-fab.lg-floating { position: fixed; top: 20px; right: 120px; z-index: 2147482000 }
#lg-fab[aria-expanded="true"] { background: var(--lg-ctrl) !important }

/* Panneau Apparence */
#lg-panel { position: fixed; top: 84px; right: 24px; z-index: 2147482000; width: 360px; max-width: calc(100vw - 48px); box-sizing: border-box; padding: 0; border-radius: 32px; overflow: hidden; color: var(--lg-text); font-family: Geist, Inter, Arial, sans-serif; animation: lgIn .3s cubic-bezier(.2,.8,.2,1); --lg-blur: 40px }
#lg-panel .lg-pbody { max-height: calc(100vh - 200px); overflow-y: auto; overscroll-behavior: contain; scrollbar-width: none; box-sizing: border-box; padding: 22px; display: flex; flex-direction: column; gap: 18px }
#lg-panel .lg-pbody::-webkit-scrollbar { display: none }
#lg-panel[hidden] { display: none }
html[data-lg-theme] #lg-panel.lg-glass { background: color-mix(in srgb, var(--lg-tint) 72%, var(--lg-glass)) !important }
#lg-panel h2 { margin: 0; font-size: 20px; font-weight: 600 }
#lg-panel h3 { margin: 0 0 10px; font-size: 15px; font-weight: 600 }
#lg-panel button { font: inherit; color: inherit; cursor: pointer }
.lg-ph { display: flex; align-items: center; justify-content: space-between }
.lg-round { width: 44px; height: 44px; border-radius: 999px; border: 0; background: var(--lg-ctrl); display: flex; align-items: center; justify-content: center }
.lg-themes { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px }
.lg-tc { padding: 6px; border-radius: 22px; border: 2px solid transparent; background: var(--lg-ctrl); display: flex; flex-direction: column; gap: 8px; text-align: left }
.lg-tc[aria-pressed="true"] { border-color: var(--lg-primary) }
.lg-tc b { font-size: 15px; font-weight: 600; padding: 0 6px }
.lg-tc small { font-size: 13px; color: var(--lg-text2); padding: 0 6px 6px; margin-top: -6px }
.lg-prev { position: relative; display: block; height: 84px; border-radius: 16px; overflow: hidden }
.lg-prev i { position: absolute; inset: 14px 18px; border-radius: 12px }
.lg-prev u { position: absolute; left: 30px; height: 6px; border-radius: 9px }
.lg-seg { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 4px; padding: 4px; border-radius: 999px; background: var(--lg-ctrl); border: 1px solid var(--lg-gb) }
.lg-seg button { height: 40px; border-radius: 999px; border: 0; background: transparent; font-size: 15px; font-weight: 500; transition: background-color .25s }
.lg-seg button[aria-pressed="true"] { background: var(--lg-primary); color: var(--lg-onprimary) !important }
.lg-presets { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; margin-top: 10px }
.lg-presets[hidden] { display: none }
.lg-sw { width: 44px; height: 44px; border-radius: 999px; border: 2px solid transparent; padding: 3px; background: transparent }
.lg-sw span { display: block; width: 100%; height: 100%; border-radius: 999px; box-shadow: inset 0 0 0 1px rgba(255,255,255,.25) }
.lg-sw[aria-pressed="true"], .lg-col.on { border-color: var(--lg-primary) }
.lg-col { height: 44px; padding: 0 14px 0 6px; border-radius: 999px; border: 2px solid var(--lg-gb); display: flex; align-items: center; gap: 8px; font-size: 15px; cursor: pointer }
.lg-col input { width: 30px; height: 30px; padding: 0; border: 0; border-radius: 999px; background: transparent; cursor: pointer }
.lg-row { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 10px }
.lg-row label { font-size: 15px; font-weight: 600 }
.lg-row span { font-size: 13px; color: var(--lg-text2); font-variant-numeric: tabular-nums }
#lg-panel input[type="range"] { width: 100%; margin: 0; accent-color: var(--lg-primary) }
.lg-switch { display: grid; grid-template-columns: 1fr auto; gap: 2px 12px; align-items: center; cursor: pointer }
.lg-switch b { font-size: 15px; font-weight: 600 }
.lg-switch small { grid-column: 1; font-size: 13px; color: var(--lg-text2); line-height: 1.4 }
.lg-switch input { grid-row: 1 / span 2; grid-column: 2; width: 20px; height: 20px; accent-color: var(--lg-primary) }

/* Plein écran pochette */
#lg-im { position: fixed; inset: 0; z-index: 2147483000; display: flex; align-items: center; justify-content: center; overflow: hidden; color: var(--lg-text); font-family: Geist, Inter, Arial, sans-serif; animation: lgFade .35s ease-out }
#lg-im[hidden] { display: none }
#lg-im { flex-direction: column; gap: 36px }
#lg-im .lg-ctrls { position: relative; display: flex; align-items: center; gap: 12px; padding: 10px 16px; border-radius: 999px }
#lg-im .lg-ctrls button { position: relative; width: 48px; height: 48px; border-radius: 999px; border: 0; background: transparent; color: var(--lg-text); display: flex; align-items: center; justify-content: center; transition: transform .2s, background-color .2s, opacity .2s, color .2s }
#lg-im .lg-ctrls button:hover { background: var(--lg-ctrl) }
#lg-im .lg-ctrls button:active { transform: scale(.92) }
#lg-im .lg-ctrls .lg-mode { opacity: .6 }
#lg-im .lg-ctrls .lg-mode[aria-pressed="true"] { opacity: 1; color: var(--lg-accent) }
#lg-im .lg-ctrls .lg-mode.is-one::after { content: "1"; position: absolute; top: 9px; right: 8px; font-size: 10px; font-weight: 600; line-height: 1 }
#lg-im .lg-ctrls .lg-play { width: 64px; height: 64px; background: var(--lg-primary); color: var(--lg-onprimary); box-shadow: 0 12px 30px rgba(0,0,0,.3) }
#lg-im .lg-ctrls .lg-play:hover { background: var(--lg-primary); transform: scale(1.05) }
#lg-im .lg-play .i-pause, #lg-im .lg-play.is-playing .i-play { display: none }
#lg-im .lg-play.is-playing .i-pause { display: block }
#lg-im .lg-im-bg { position: absolute; inset: 0; background-position: center; background-size: cover; background-color: var(--lg-page) }
#lg-im.cover .lg-im-bg { inset: auto; left: 50%; top: 50%; width: 192px; height: 120px; margin: -60px 0 0 -96px; transform: scale(var(--lg-bgs, 14)); filter: blur(7px) saturate(170%); will-change: transform }
#lg-im .lg-im-scrim { position: absolute; inset: 0; background: transparent }
#lg-im.cover .lg-im-scrim { background: var(--lg-imscrim) }
#lg-im .lg-im-cover { animation: lgIn .45s cubic-bezier(.2,.8,.2,1); position: relative; width: min(56vh, 78vw, 720px); aspect-ratio: 1; padding: 0; border: 0; border-radius: 32px; overflow: hidden; cursor: zoom-out; box-shadow: 0 50px 120px rgba(0,0,0,.5), inset 0 0 0 1px rgba(255,255,255,.2); transition: transform .35s; background: transparent }
#lg-im .lg-im-cover:hover { transform: scale(1.012) }
#lg-im .lg-im-cover img { display: block; width: 100%; height: 100%; object-fit: cover }
#lg-im .lg-pill { position: absolute; left: 50%; bottom: 28px; transform: translateX(-50%); width: 380px; max-width: calc(100vw - 32px); box-sizing: border-box; padding: 6px; border-radius: 999px; display: flex; align-items: center; gap: 4px; opacity: .35; transition: opacity .3s }
#lg-im .lg-pill:hover, #lg-im .lg-pill:focus-within { opacity: 1 }
#lg-im .lg-pill .lg-seg { flex: 1; padding: 0; border: 0; background: transparent }
#lg-im button { font: inherit; color: inherit; cursor: pointer }

html[data-lg-theme] :focus-visible { outline: 2px solid var(--lg-accent) !important; outline-offset: 3px }
@keyframes lgIn { from { opacity: 0; transform: scale(.97) } to { opacity: 1; transform: none } }
@keyframes lgFade { from { opacity: 0 } to { opacity: 1 } }
#lg-im .lg-pill { animation: none }
html.lg-im-open #lg-light { z-index: 2147483001 }
@media (prefers-reduced-motion: reduce) { #lg-panel, #lg-im, #lg-bg, .lg-edge, .lg-glass, .lg-side { animation: none !important; transition: none !important } #lg-light { display: none } }
${iconCSS}
`;

  /* ---------- Injection du style ---------- */
  const style = document.createElement('style');
  style.id = 'lg-style';
  style.textContent = CSS;
  const whenRoot = (fn) => {
    if (document.documentElement) return fn();
    new MutationObserver((m, o) => { if (document.documentElement) { o.disconnect(); fn(); } }).observe(document, { childList: true });
  };
  whenRoot(() => {
    (document.head || document.documentElement).appendChild(style);
    document.documentElement.setAttribute('data-lg-theme', S.theme);
  });

  const applySettings = () => {
    const html = document.documentElement;
    html.setAttribute('data-lg-theme', S.theme);
    html.style.setProperty('--lg-frost', S.frost + '%');
    html.style.setProperty('--lg-blur', Math.round(12 + S.frost * 0.36) + 'px');
    if (S.clean) html.setAttribute('data-lg-clean', ''); else html.removeAttribute('data-lg-clean');
    html.setAttribute('data-lg-bg', S.im);
    if (custom) custom.style.background = S.preset < 0 ? S.color : PRESETS[S.preset].bg;
    syncPanel();
    syncImmersive();
  };

  /* ---------- Éléments ajoutés ---------- */
  const SV = (inner, sw) => '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="' + (sw || 2.2) + '" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + inner + '</svg>';
  const I_SHUF = SV('<path d="M3 7h3.5c1.4 0 2.6.7 3.4 1.8l4.2 6.4c.8 1.1 2 1.8 3.4 1.8H21M18 14l3 3-3 3M3 17h3.5c1 0 2-.4 2.7-1.1M21 7h-3.5c-1 0-2 .4-2.7 1.1M18 4l3 3-3 3"/>');
  const I_REP = SV('<path d="M17 2.5 20.5 6 17 9.5M3.5 11V9.5A3.5 3.5 0 0 1 7 6h13.5M7 21.5 3.5 18 7 14.5M20.5 13v1.5A3.5 3.5 0 0 1 17 18H3.5"/>');
  const I_PREV = SV('<path d="M11.5 7.2v9.6c0 .8-.9 1.3-1.6.8L3.4 12.8a1 1 0 0 1 0-1.6l6.5-4.8c.7-.5 1.6 0 1.6.8zM20.5 7.2v9.6c0 .8-.9 1.3-1.6.8l-6.5-4.8a1 1 0 0 1 0-1.6l6.5-4.8c.7-.5 1.6 0 1.6.8z" fill="currentColor" stroke="none"/>');
  const I_NEXT = SV('<path d="M3.5 7.2v9.6c0 .8.9 1.3 1.6.8l6.5-4.8a1 1 0 0 0 0-1.6L5.1 6.4c-.7-.5-1.6 0-1.6.8zM12.5 7.2v9.6c0 .8.9 1.3 1.6.8l6.5-4.8a1 1 0 0 0 0-1.6l-6.5-4.8c-.7-.5-1.6 0-1.6.8z" fill="currentColor" stroke="none"/>');
  const I_PLAY = SV('<path d="M7 5.3v13.4c0 1 1.1 1.6 1.9 1.1l10.4-6.7c.8-.5.8-1.7 0-2.2L8.9 4.2C8.1 3.7 7 4.3 7 5.3z" fill="currentColor" stroke="none"/>').replace('<svg ', '<svg class="i-play" width="28" height="28" ').replace(' width="24" height="24"', '');
  const I_PAUSE = SV('<rect x="6" y="4.5" width="4.2" height="15" rx="1.6" fill="currentColor" stroke="none"/><rect x="13.8" y="4.5" width="4.2" height="15" rx="1.6" fill="currentColor" stroke="none"/>').replace('<svg ', '<svg class="i-pause" width="28" height="28" ').replace(' width="24" height="24"', '');
  const X_ICON = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
  const PALETTE = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" aria-hidden="true"><path d="M12 3.5a8.5 8.5 0 0 0 0 17c1.2 0 1.8-.8 1.8-1.7 0-1.3-1-1.6-1-2.7 0-1 .8-1.6 1.8-1.6h2.1a3.8 3.8 0 0 0 3.8-3.8C20.5 6.7 16.7 3.5 12 3.5z" fill="currentColor" fill-opacity=".16"/><circle cx="8" cy="11" r="1.1" fill="currentColor" stroke="none"/><circle cx="10.5" cy="7.5" r="1.1" fill="currentColor" stroke="none"/><circle cx="14.8" cy="7.8" r="1.1" fill="currentColor" stroke="none"/></svg>';

  let bg, custom, scrim, light, fab, panel, im, side, player, scroller;
  let dirtyRects = true;
  let coverUrl = '';

  const edge = (el) => {
    if (el && !el.querySelector(':scope > .lg-edge')) {
      const e = document.createElement('div');
      e.className = 'lg-edge';
      e.setAttribute('aria-hidden', 'true');
      e.innerHTML = '<div class="lg-sheen"></div><div class="lg-ring"><div class="lg-spot"></div></div>';
      el.appendChild(e);
      dirtyRects = true;
    }
  };

  const buildPanel = () => {
    panel = document.createElement('div');
    panel.id = 'lg-panel';
    panel.className = 'lg-glass';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'Apparence');
    panel.hidden = true;
    panel.innerHTML = '<div class="lg-pbody">' +
      '<div class="lg-ph"><h2>Apparence</h2><button class="lg-round" data-act="close" aria-label="Fermer">' + X_ICON + '</button></div>' +
      '<div><h3>Thème</h3><div class="lg-themes">' +
        '<button class="lg-tc" data-theme="blanc"><span class="lg-prev" style="background:radial-gradient(circle at 25% 30%,#9fd6e8 0%,transparent 55%),radial-gradient(circle at 80% 75%,#cdbdf3 0%,transparent 55%),#E9ECF1"><i style="background:rgba(255,255,255,.55);border:1px solid rgba(255,255,255,.9);box-shadow:0 8px 20px rgba(40,50,80,.15)"></i><u style="top:28px;width:44px;background:#121419"></u><u style="top:40px;width:28px;height:5px;background:rgba(18,20,25,.4)"></u></span><b>Verre blanc</b><small>Lumineux, nacré</small></button>' +
        '<button class="lg-tc" data-theme="noir"><span class="lg-prev" style="background:radial-gradient(circle at 25% 30%,#1d6f8a 0%,transparent 55%),radial-gradient(circle at 80% 75%,#3b2a7a 0%,transparent 55%),#000"><i style="background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.16);box-shadow:0 8px 20px rgba(0,0,0,.4)"></i><u style="top:28px;width:44px;background:#F4F5F7"></u><u style="top:40px;width:28px;height:5px;background:rgba(244,245,247,.45)"></u></span><b>Verre noir</b><small>Profond, obsidienne</small></button>' +
      '</div></div>' +
      '<div><h3>Fond</h3><div class="lg-seg"><button data-im="cover">Pochette floutée</button><button data-im="custom">Fond perso</button></div>' +
        '<div class="lg-presets">' +
          PRESETS.map((p, i) => '<button class="lg-sw" data-preset="' + i + '" aria-label="' + p.name + '" title="' + p.name + '"><span style="background:' + p.bg + '"></span></button>').join('') +
          '<label class="lg-col"><input type="color" aria-label="Couleur de fond personnalisée">Couleur</label>' +
        '</div></div>' +
      '<div><div class="lg-row"><label for="lg-blur">Intensité du verre</label><span id="lg-blurv"></span></div><input id="lg-blur" type="range" min="0" max="100" step="5"></div>' +
      '<label class="lg-switch"><b>Accueil épuré</b><input type="checkbox" id="lg-clean"><small>Garde seulement Écouté récemment, Playlists suivies, Flow et En boucle chez toi.</small></label></div>';
    document.body.appendChild(panel);
    edge(panel);

    panel.addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (!b) return;
      if (b.dataset.act === 'close') togglePanel(false);
      if (b.dataset.theme) { S.theme = b.dataset.theme; save(); applySettings(); }
      if (b.dataset.im) { S.im = b.dataset.im; save(); applySettings(); }
      if (b.dataset.preset) { S.preset = Number(b.dataset.preset); S.im = 'custom'; save(); applySettings(); }
    });
    panel.querySelector('input[type=color]').addEventListener('input', (e) => { S.color = e.target.value; S.preset = -1; S.im = 'custom'; save(); applySettings(); });
    panel.querySelector('#lg-blur').addEventListener('input', (e) => { S.frost = Number(e.target.value); save(); applySettings(); });
    panel.querySelector('#lg-clean').addEventListener('change', (e) => { S.clean = e.target.checked; save(); applySettings(); });
  };

  const syncPanel = () => {
    if (!panel) return;
    panel.querySelectorAll('[data-theme]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.theme === S.theme)));
    panel.querySelectorAll('[data-im]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.im === S.im)));
    panel.querySelectorAll('[data-preset]').forEach((b) => b.setAttribute('aria-pressed', String(Number(b.dataset.preset) === S.preset)));
    panel.querySelector('.lg-presets').hidden = S.im !== 'custom';
    panel.querySelector('.lg-col').classList.toggle('on', S.preset < 0);
    panel.querySelector('input[type=color]').value = S.color;
    panel.querySelector('#lg-blur').value = S.frost;
    panel.querySelector('#lg-blurv').textContent = S.frost + ' %';
    panel.querySelector('#lg-clean').checked = S.clean;
  };

  const togglePanel = (open) => {
    const show = typeof open === 'boolean' ? open : panel.hidden;
    panel.hidden = !show;
    dirtyRects = true;
    if (fab) fab.setAttribute('aria-expanded', String(show));
  };

  const buildImmersive = () => {
    im = document.createElement('div');
    im.id = 'lg-im';
    im.hidden = true;
    im.setAttribute('role', 'dialog');
    im.setAttribute('aria-label', 'Pochette en plein écran');
    im.innerHTML =
      '<div class="lg-im-bg" aria-hidden="true"></div><div class="lg-im-scrim" aria-hidden="true"></div>' +
      '<button class="lg-im-cover" data-act="close" aria-label="Quitter le plein écran"><img alt=""></button>' +
      '<div class="lg-ctrls lg-glass" role="group" aria-label="Lecture">' +
        '<button class="lg-mode" data-ctl="shuffle" aria-label="Lecture aléatoire" aria-pressed="false">' + I_SHUF + '</button>' +
        '<button data-ctl="prev" aria-label="Titre précédent">' + I_PREV + '</button>' +
        '<button class="lg-play" data-ctl="play" aria-label="Lecture">' + I_PLAY + I_PAUSE + '</button>' +
        '<button data-ctl="next" aria-label="Titre suivant">' + I_NEXT + '</button>' +
        '<button class="lg-mode" data-ctl="repeat" aria-label="Répéter" aria-pressed="false">' + I_REP + '</button>' +
      '</div>' +
      '<div class="lg-pill lg-glass"><div class="lg-seg"><button data-im="cover">Pochette floutée</button><button data-im="custom">Fond perso</button></div>' +
      '<button class="lg-round" data-act="close" aria-label="Quitter le plein écran">' + X_ICON + '</button></div>';
    document.body.appendChild(im);
    edge(im.querySelector('.lg-pill'));
    edge(im.querySelector('.lg-ctrls'));
    im.addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (!b) return;
      if (b.dataset.ctl) {
        const t = player && player.querySelector(CTL[b.dataset.ctl]);
        if (t) t.click();
        setTimeout(syncCtrls, 120); setTimeout(syncCtrls, 450);
        return;
      }
      if (b.dataset.act === 'close') closeImmersive();
      if (b.dataset.im) { S.im = b.dataset.im; save(); applySettings(); }
    });
  };

  // Commandes du plein écran : elles cliquent sur les vrais boutons du lecteur Deezer
  const CTL = {
    shuffle: 'button[data-testid^="shuffle_play_button"]',
    prev: '[data-testid="previous_track_button"]',
    play: 'button[data-testid^="play_button"]',
    next: '[data-testid="next_track_button"]',
    repeat: 'button[data-testid^="repeat_button"]'
  };
  const syncCtrls = () => {
    if (!im || im.hidden || !player) return;
    const tid = (sel) => (player.querySelector(sel)?.getAttribute('data-testid') || '');
    const play = tid(CTL.play), shuf = tid(CTL.shuffle), rpt = tid(CTL.repeat);
    const pb = im.querySelector('.lg-play');
    const playing = /pause/i.test(play) || /pause/i.test(player.querySelector(CTL.play)?.getAttribute('aria-label') || '');
    pb.classList.toggle('is-playing', playing);
    pb.setAttribute('aria-label', playing ? 'Pause' : 'Lecture');
    im.querySelector('[data-ctl="shuffle"]').setAttribute('aria-pressed', String(/_on$/.test(shuf)));
    const rb = im.querySelector('[data-ctl="repeat"]');
    rb.setAttribute('aria-pressed', String(!!rpt && !/_off$/.test(rpt)));
    rb.classList.toggle('is-one', /_(one|single)$/.test(rpt));
  };

  const bigCover = (url) => url.replace(/\/\d+x\d+(-[^/]*)?\.jpg/, '/1000x1000-000000-80-0-0.jpg');

  const syncImmersive = () => {
    if (!im) return;
    const custom = S.im === 'custom';
    const big = coverUrl ? bigCover(coverUrl) : '';
    im.classList.toggle('cover', !custom);
    im.querySelector('.lg-im-bg').style.background = custom
      ? (S.preset < 0 ? S.color : PRESETS[S.preset].bg)
      : (big ? 'center / cover no-repeat url("' + coverUrl.replace(/\/\d+x\d+(-[^/]*)?\.jpg/, '/250x250-000000-80-0-0.jpg') + '")' : 'var(--lg-page)');
    const img = im.querySelector('img');
    if (big && img.getAttribute('src') !== big) img.src = big;
    img.alt = 'Pochette : ' + (document.querySelector('.lg-player [data-testid="item_title"]')?.textContent || '');
    im.querySelectorAll('[data-im]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.im === S.im)));
  };

  let ctrlTimer = 0;
  const openImmersive = () => { syncImmersive(); im.hidden = false; document.documentElement.classList.add('lg-im-open'); togglePanel(false); dirtyRects = true; syncCtrls(); clearInterval(ctrlTimer); ctrlTimer = setInterval(syncCtrls, 500); im.querySelector('.lg-play').focus({ preventScroll: true }); };
  const closeImmersive = () => { im.hidden = true; clearInterval(ctrlTimer); ctrlTimer = 0; document.documentElement.classList.remove('lg-im-open'); dirtyRects = true; };

  /* ---------- Repérage des blocs Deezer ---------- */
  const fixedAncestor = (el) => {
    while (el && el !== document.body) {
      if (getComputedStyle(el).position === 'fixed') return el;
      el = el.parentElement;
    }
    return null;
  };
  const isHome = () => /^\/[a-z]{2}\/?$/.test(location.pathname);

  // Largeur réelle de la barre latérale (suit le mode réduit de Deezer)
  const syncSideWidth = () => {
    const top = document.getElementById('page_topbar');
    if (!top) return;
    const w = Math.round(top.getBoundingClientRect().left);
    if (w > 40) document.documentElement.style.setProperty('--lg-sw', w + 'px');
    const was = document.documentElement.hasAttribute('data-lg-collapsed');
    const now = w > 0 && w < 150;
    if (now !== was) {
      document.documentElement.toggleAttribute('data-lg-collapsed', now);
      dirtyRects = true;
    }
  };

  let lastPath = '';
  const tag = () => {
    // Barre latérale : recherchée seulement si elle a disparu
    if (!side || !side.isConnected) {
      side = fixedAncestor(document.querySelector('svg[data-testid^="House"]'));
      if (side) { side.classList.add('lg-side', 'lg-glass'); scroller = null; dirtyRects = true; }
    }
    if (side) {
      edge(side);
      if (!scroller || !scroller.isConnected) {
        scroller = [...side.children].find((c) => /auto|scroll/.test(getComputedStyle(c).overflowY));
        if (scroller) scroller.classList.add('lg-side-scroll');
      }
    }
    // Notre propre bouton pour rouvrir la barre réduite (il clique sur celui de Deezer)
    if (side && !side.querySelector(':scope > .lg-reopen')) {
      const b = document.createElement('button');
      b.className = 'lg-reopen';
      b.setAttribute('aria-label', 'Afficher la barre latérale');
      b.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3.5" y="4.5" width="17" height="15" rx="3.5"/><path d="M9.5 4.5v15" /><path d="M13.5 10l2 2-2 2"/></svg>';
      b.addEventListener('click', () => {
        const t = document.querySelector('button[aria-label="Afficher la barre latérale"]') || [...document.querySelectorAll('button[aria-label*="barre latérale"]')].find((x) => x !== b);
        if (t) t.click();
      });
      side.appendChild(b);
    }
    if (!player || !player.isConnected) {
      player = fixedAncestor(document.querySelector('[data-testid="progress_bar"]'));
      if (player) { player.classList.add('lg-player', 'lg-glass'); dirtyRects = true; }
    }
    if (player) edge(player);

    // Bouton Apparence dans la barre du haut
    const top = document.getElementById('page_topbar');
    if (fab && top && !top.contains(fab)) {
      const firstAction = top.querySelector(':scope > .topbar-action');
      if (firstAction) { fab.classList.remove('lg-floating'); top.insertBefore(fab, firstAction); }
      if (window.ResizeObserver && !top.__lgRO) { top.__lgRO = new ResizeObserver(() => { syncSideWidth(); dirtyRects = true; }); top.__lgRO.observe(top); }
      syncSideWidth();
      dirtyRects = true;
    }
    tagNotifications();

    // Accueil épuré : seulement quand la page ou ses sections changent
    const pathChanged = location.pathname !== lastPath;
    lastPath = location.pathname;
    const home = isHome();
    document.querySelectorAll(pathChanged ? '[data-testid="section-renderer"]' : '[data-testid="section-renderer"]:not([data-lg-k])').forEach((sec) => {
      const t = (sec.querySelector('[data-testid="section_title"]')?.textContent || '').replace('Voir tout', '').trim();
      if (!t) return; // titre pas encore chargé : on réessaiera au prochain passage
      sec.setAttribute('data-lg-k', '');
      sec.classList.toggle('lg-hide', home && !KEEP.some((k) => t.startsWith(k)));
    });
  };

  // Pochette en cours → fond (vérifiée une fois par seconde, très léger)
  const syncCover = () => {
    const img = player && player.querySelector('[data-testid="item_cover"] img');
    const src = img ? img.src : '';
    if (src && src !== coverUrl) {
      coverUrl = src;
      bg.style.backgroundImage = 'url("' + src.replace(/\/\d+x\d+(-[^/]*)?\.jpg/, '/250x250-000000-80-0-0.jpg') + '")';
      if (!im.hidden) syncImmersive();
    }
  };

  // Le fond flouté est petit puis agrandi : flou presque gratuit
  const sizeBg = () => {
    const sc = Math.max(innerWidth / 192, innerHeight / 120) * 1.25;
    document.documentElement.style.setProperty('--lg-bgs', sc.toFixed(2));
  };

  /* ---------- Notifications : tout marquer comme lu ---------- */
  const gw = async (method, data, token) => {
    const r = await fetch('/ajax/gw-light.php?method=' + method + '&input=3&api_version=1.0&api_token=' + encodeURIComponent(token || '') + '&cid=' + Math.floor(Math.random() * 1e9), { method: 'POST', credentials: 'include', body: JSON.stringify(data || {}) });
    return r.json();
  };
  const notifToken = async () => (await gw('deezer.getUserData', {}, '')).results.checkForm;
  const NOTIF_KEY = 'lg-notif-cleared';
  const markAllRead = async (btn) => {
    const label = btn.querySelector('span');
    btn.disabled = true; label.textContent = 'En cours…';
    try {
      const tok = await notifToken();
      const ids = []; let last = null, newest = '';
      for (let i = 0; i < 5; i++) {
        const res = (await gw('notification.list', last ? { LAST_NOTIFICATION_ID: last, NB: 20 } : { NB: 20 }, tok)).results;
        const list = (res && res.data) || [];
        if (!list.length) break;
        if (!newest) newest = list[0].date || '';
        list.forEach((n) => ids.push(n.id));
        last = list[list.length - 1].id;
        if (list.length < 20) break;
      }
      if (ids.length) await gw('notification.markAsRead', { notif_ids: ids }, tok);
      try { localStorage.setItem(NOTIF_KEY, newest || new Date().toISOString()); } catch (e) {}
      document.documentElement.setAttribute('data-lg-notif-clear', '');
      label.textContent = 'Tout est lu';
    } catch (e) {
      label.textContent = 'Réessayer';
      btn.disabled = false;
    }
  };
  const tagNotifications = () => {
    const nb = document.querySelector('#page_topbar button[aria-label="Notifications"]');
    const wrap = nb && (nb.closest('.topbar-action') || nb.parentElement);
    if (wrap) [...wrap.querySelectorAll('span')].forEach((sp) => { if (!sp.children.length && /^\d+\+?$/.test(sp.textContent.trim())) sp.classList.add('lg-notif-badge'); });
    const h = document.querySelector('.popper-notifications > h2');
    if (h && !h.querySelector('.lg-readall')) {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'lg-readall';
      b.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2.5 12.5l4.5 4.5L17 7M12 16l1 1L21.5 8.5"/></svg><span>Tout marquer comme lu</span>';
      if (document.documentElement.hasAttribute('data-lg-notif-clear')) { b.disabled = true; b.querySelector('span').textContent = 'Tout est lu'; }
      b.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); markAllRead(b); });
      h.appendChild(b);
    }
  };
  // Au démarrage : le badge reste caché tant qu'aucune nouvelle notification n'est arrivée
  const checkNewNotifs = async () => {
    let cleared = '';
    try { cleared = localStorage.getItem(NOTIF_KEY) || ''; } catch (e) {}
    if (!cleared) return;
    document.documentElement.setAttribute('data-lg-notif-clear', '');
    try {
      const res = (await gw('notification.list', { NB: 1 }, await notifToken())).results;
      const newest = res && res.data && res.data[0] && res.data[0].date;
      if (newest && newest > cleared) document.documentElement.removeAttribute('data-lg-notif-clear');
    } catch (e) {}
  };

  /* ---------- Lumière qui suit la souris (uniquement des transforms) ---------- */
  let px = -2000, py = -2000, raf = 0, panels = [];
  const measure = () => {
    panels = [...document.querySelectorAll('.lg-edge')].map((e) => {
      const p = e.parentElement;
      const r = p.getBoundingClientRect();
      return { e, sheen: e.firstChild, spot: e.lastChild.firstChild, r, on: false, visible: r.width > 0 && r.height > 0 };
    });
    dirtyRects = false;
  };
  const paint = () => {
    raf = 0;
    if (dirtyRects) measure();
    light.style.transform = 'translate3d(' + (px - 420) + 'px,' + (py - 420) + 'px,0)';
    for (const it of panels) {
      if (!it.visible) continue;
      const r = it.r;
      const d = Math.hypot(Math.max(r.left - px, 0, px - r.right), Math.max(r.top - py, 0, py - r.bottom));
      const lo = d < 150 ? 1 - d / 150 : 0;
      if (lo === 0 && !it.on) continue;
      if ((lo > 0) !== it.on) it.e.classList.toggle('on', lo > 0);
      it.on = lo > 0;
      it.e.style.opacity = lo.toFixed(2);
      if (lo > 0) {
        const x = px - r.left, y = py - r.top;
        it.sheen.style.transform = 'translate3d(' + (x - 280) + 'px,' + (y - 280) + 'px,0)';
        it.spot.style.transform = 'translate3d(' + (x - 200) + 'px,' + (y - 200) + 'px,0)';
      }
    }
  };
  const queue = () => { if (!raf) raf = requestAnimationFrame(paint); };
  window.addEventListener('pointermove', (e) => { px = e.clientX; py = e.clientY; queue(); }, { passive: true });
  document.addEventListener('pointerleave', () => { px = -2000; py = -2000; queue(); });
  window.addEventListener('resize', () => { sizeBg(); syncSideWidth(); dirtyRects = true; }, { passive: true });

  /* ---------- Démarrage ---------- */
  const start = () => {
    if (document.getElementById('lg-bg')) return;
    bg = document.createElement('div'); bg.id = 'lg-bg';
    custom = document.createElement('div'); custom.id = 'lg-custom';
    scrim = document.createElement('div'); scrim.id = 'lg-scrim';
    light = document.createElement('div'); light.id = 'lg-light';
    const fade = document.createElement('div'); fade.id = 'lg-fade'; fade.setAttribute('aria-hidden', 'true'); document.body.appendChild(fade);
    [bg, custom, scrim, light].forEach((el) => { el.setAttribute('aria-hidden', 'true'); });
    document.body.prepend(light); document.body.prepend(scrim); document.body.prepend(custom); document.body.prepend(bg);
    sizeBg();

    fab = document.createElement('button');
    fab.id = 'lg-fab';
    fab.className = 'lg-glass lg-floating';
    fab.setAttribute('aria-label', 'Apparence et thèmes');
    fab.setAttribute('aria-expanded', 'false');
    fab.innerHTML = PALETTE;
    document.body.appendChild(fab);
    edge(fab);
    fab.addEventListener('click', () => togglePanel());

    buildPanel();
    buildImmersive();
    applySettings();

    // Clic sur la pochette du lecteur → plein écran
    document.addEventListener('click', (e) => {
      const c = e.target.closest('.lg-player [data-testid="item_cover"]');
      if (!c) return;
      e.preventDefault(); e.stopPropagation();
      openImmersive();
    }, true);
    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      if (!im.hidden) closeImmersive();
      else if (!panel.hidden) togglePanel(false);
    });

    // Repérage regroupé : au plus une fois toutes les 250 ms, et seulement sur ajout/retrait d'éléments
    let timer = 0;
    new MutationObserver(() => {
      if (timer) return;
      timer = setTimeout(() => { timer = 0; tag(); }, 250);
    }).observe(document.body, { childList: true, subtree: true });
    tag();
    setInterval(syncCover, 1000);
    setTimeout(checkNewNotifs, 3000);
    syncCover();
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
