import React, { useEffect, useMemo, useRef, useState } from 'react';

const LAST_URL_KEY = 'omnistream.browser.lastUrl';
const DEFAULT_URL = 'https://www.google.com';
const TEST_URL = 'https://httpbin.org/cookies';

export default function BrowserPanel() {
    const webviewRef = useRef<any>(null);

    const initialUrl = useMemo(() => {
        return localStorage.getItem(LAST_URL_KEY) || DEFAULT_URL;
    }, []);

    const [status, setStatus] = useState('Idle');

    useEffect(() => {
        const wv = webviewRef.current;
        if (!wv) return;

        const handleNavigate = (e: any) => {
            const nextUrl = e?.url;
            if (typeof nextUrl === 'string' && nextUrl.length > 0) {
                localStorage.setItem(LAST_URL_KEY, nextUrl);
            }
        };

        const handleStart = () => setStatus('Loading…');
        const handleStop = () => setStatus('Idle');

        wv.addEventListener('did-navigate', handleNavigate);
        wv.addEventListener('did-navigate-in-page', handleNavigate);
        wv.addEventListener('did-start-loading', handleStart);
        wv.addEventListener('did-stop-loading', handleStop);

        return () => {
            wv.removeEventListener('did-navigate', handleNavigate);
            wv.removeEventListener('did-navigate-in-page', handleNavigate);
            wv.removeEventListener('did-start-loading', handleStart);
            wv.removeEventListener('did-stop-loading', handleStop);
        };
    }, []);

    const runPersistenceTest = () => {
        const wv = webviewRef.current;
        if (!wv) return;

        const onFinish = async () => {
            try {
                // Set a 1-year cookie on httpbin.org, then reload so httpbin shows it.
                await wv.executeJavaScript(
                    `document.cookie = "omnistream_test=1; Max-Age=31536000; Path=/; SameSite=Lax"; location.reload();`,
                    true
                );
            } finally {
                wv.removeEventListener('did-finish-load', onFinish);
            }
        };

        wv.addEventListener('did-finish-load', onFinish);
        wv.loadURL(TEST_URL);
    };

    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <div
                style={{
                    padding: 8,
                    borderBottom: '1px solid rgba(255,255,255,0.12)',
                    display: 'flex',
                    gap: 12,
                    alignItems: 'center',
                }}
            >
                <h1 style={{ margin: 0, fontSize: 18 }}>Browser</h1>
                <button onClick={runPersistenceTest}>Run persistence test</button>
                <span style={{ opacity: 0.7, fontSize: 12 }}>{status}</span>
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
