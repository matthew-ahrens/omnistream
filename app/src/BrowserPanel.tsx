import React, { useEffect, useMemo, useRef, useState } from 'react';

const LAST_URL_KEY = 'omnistream.browser.lastUrl';
const DEFAULT_HOME = 'https://www.google.com';

function normalizeTarget(input: string, homeUrl: string) {
    const t = (input ?? '').trim();
    if (!t) return homeUrl;

    // already a URL
    if (/^https?:\/\//i.test(t)) return t;

    // localhost / IP / port-ish
    if (/^(localhost|127\.0\.0\.1|\d{1,3}(\.\d{1,3}){3})(:\d+)?(\/.*)?$/i.test(t)) {
        return `http://${t}`;
    }

    // treat as search if spaces or no dot
    if (t.includes(' ') || !t.includes('.')) {
        return `https://www.google.com/search?q=${encodeURIComponent(t)}`;
    }

    // plain domain
    return `https://${t}`;
}

export default function BrowserPanel() {
    const webviewRef = useRef<any>(null);

    const initialUrl = useMemo(() => {
        return localStorage.getItem(LAST_URL_KEY) || DEFAULT_HOME;
    }, []);

    const [address, setAddress] = useState(initialUrl);
    const [status, setStatus] = useState<'Idle' | 'Loading'>('Idle');
    const [canBack, setCanBack] = useState(false);
    const [canForward, setCanForward] = useState(false);

    const syncNavState = () => {
        const wv = webviewRef.current;
        if (!wv) return;

        try {
            setCanBack(!!wv.canGoBack?.());
            setCanForward(!!wv.canGoForward?.());

            const url = wv.getURL?.();
            if (typeof url === 'string' && url.length > 0) {
                setAddress(url);
                localStorage.setItem(LAST_URL_KEY, url);
            }
        } catch {
            // ignore
        }
    };

    const go = (target?: string) => {
        const wv = webviewRef.current;
        if (!wv) return;

        const next = normalizeTarget(target ?? address, DEFAULT_HOME);
        localStorage.setItem(LAST_URL_KEY, next);
        wv.loadURL(next);
    };

    useEffect(() => {
        const wv = webviewRef.current;
        if (!wv) return;

        const handleNavigate = (e: any) => {
            const nextUrl = e?.url;
            if (typeof nextUrl === 'string' && nextUrl.length > 0) {
                setAddress(nextUrl);
                localStorage.setItem(LAST_URL_KEY, nextUrl);
            }
            syncNavState();
        };

        const handleStart = () => setStatus('Loading');
        const handleStop = () => {
            setStatus('Idle');
            syncNavState();
        };

        wv.addEventListener('did-navigate', handleNavigate);
        wv.addEventListener('did-navigate-in-page', handleNavigate);
        wv.addEventListener('did-start-loading', handleStart);
        wv.addEventListener('did-stop-loading', handleStop);
        wv.addEventListener('did-finish-load', syncNavState);

        setTimeout(syncNavState, 0);

        return () => {
            wv.removeEventListener('did-navigate', handleNavigate);
            wv.removeEventListener('did-navigate-in-page', handleNavigate);
            wv.removeEventListener('did-start-loading', handleStart);
            wv.removeEventListener('did-stop-loading', handleStop);
            wv.removeEventListener('did-finish-load', syncNavState);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <div
                style={{
                    padding: 8,
                    borderBottom: '1px solid rgba(255,255,255,0.12)',
                    display: 'flex',
                    gap: 8,
                    alignItems: 'center',
                }}
            >
                <button onClick={() => webviewRef.current?.goBack?.()} disabled={!canBack} title="Back">
                    Back
                </button>
                <button onClick={() => webviewRef.current?.goForward?.()} disabled={!canForward} title="Forward">
                    Fwd
                </button>
                <button onClick={() => webviewRef.current?.reload?.()} title="Reload">
                    Reload
                </button>
                <button onClick={() => go(DEFAULT_HOME)} title="Home">
                    Home
                </button>

                <form
                    style={{ flex: 1 }}
                    onSubmit={(e) => {
                        e.preventDefault();
                        go();
                    }}
                >
                    <input
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Type URL or search..."
                        spellCheck={false}
                        style={{
                            width: '100%',
                            padding: '7px 10px',
                            borderRadius: 10,
                            border: '1px solid rgba(255,255,255,0.14)',
                            background: 'rgba(0, 0, 0, 0.22)',
                            color: 'inherit',
                            outline: 'none',
                        }}
                    />
                </form>

                <button onClick={() => go()} title="Go">
                    Go
                </button>

                <span style={{ opacity: 0.7, fontSize: 12, paddingLeft: 6 }}>
                    {status === 'Loading' ? 'Loading...' : 'Idle'}
                </span>
            </div>

            <div style={{ flex: 1, minHeight: 0 }}>
                <webview
                    ref={(el: any) => (webviewRef.current = el)}
                    src={initialUrl}
                    partition="persist:omnistream"
                    allowpopups="true"
                    style={{ width: '100%', height: '100%' }}
                />
            </div>
        </div>
    );
}
