import React from 'react';

export default function BrowserPanel() {
    return (
        <div style={{ height: '100%', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
            <div style={{ padding: 8, borderBottom: '1px solid rgba(255,255,255,0.12)' }}>
                <h1 style={{ margin: 0, fontSize: 18 }}>Browser</h1>
            </div>

            <div style={{ flex: 1, minHeight: 0 }}>
                <webview
                    src="https://www.google.com"
                    style={{ width: '100%', height: '100%' }}
                />
            </div>
        </div>
    );
}
