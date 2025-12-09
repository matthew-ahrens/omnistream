import React, { useState } from 'react';
import './App.css';

type ViewName = 'home' | 'services' | 'lists' | 'settings';

export default function App() {
    const [currentView, setCurrentView] = useState<ViewName>('home');

    const renderView = () => {
        switch (currentView) {
            case 'services':
                return (
                    <div className="placeholder-view">
                        <h1>Services</h1>
                        <p>Here you&apos;ll manage which streaming services you pay for and which ones you don&apos;t.</p>
                    </div>
                );
            case 'lists':
                return (
                    <div className="placeholder-view">
                        <h1>Lists</h1>
                        <p>Here you&apos;ll manage Bingeing, Throwbacks, Work Shows, Background Shows, and other custom lists.</p>
                    </div>
                );
            case 'settings':
                return (
                    <div className="placeholder-view">
                        <h1>Settings</h1>
                        <p>App preferences, behavior tweaks, and future advanced options will live here.</p>
                    </div>
                );
            case 'home':
            default:
                return (
                    <div className="home-view">
                        <h1>Home</h1>
                        <p className="home-subtitle">
                            This will become your main dashboard with cards, watchable badges, and quick access to your shows.
                        </p>

                        <div className="home-grid">
                            <section className="home-section">
                                <h2>Currently Bingeing</h2>
                                <div className="section-row">
                                    <div className="show-card placeholder-card">
                                        Add a show you&apos;re locked into right now.
                                    </div>
                                </div>
                            </section>

                            <section className="home-section">
                                <h2>Throwbacks</h2>
                                <div className="section-row">
                                    <div className="show-card placeholder-card">
                                        Nostalgia / comfort rewatches live here.
                                    </div>
                                </div>
                            </section>

                            <section className="home-section">
                                <h2>Rewatch / Re-binge</h2>
                                <div className="section-row">
                                    <div className="show-card placeholder-card">
                                        Stuff you want to circle back to when the vibes are right.
                                    </div>
                                </div>
                            </section>

                            <section className="home-section">
                                <h2>Work Shows</h2>
                                <div className="section-row">
                                    <div className="show-card placeholder-card">
                                        Low-effort shows you can follow while doing other things.
                                    </div>
                                </div>
                            </section>

                            <section className="home-section">
                                <h2>Background Noise</h2>
                                <div className="section-row">
                                    <div className="show-card placeholder-card">
                                        Pure noise shows / movies for when you just need sound.
                                    </div>
                                </div>
                            </section>
                        </div>
                    </div>
                );
        }
    };

    const handleNavClick = (view: ViewName) => {
        setCurrentView(view);
    };

    const isActive = (view: ViewName) => (currentView === view ? 'active' : '');

    return (
        <div className="app-container">
            <aside className="sidebar">
                <h2>OmniStream</h2>
                <nav>
                    <ul>
                        <li
                            className={isActive('home')}
                            onClick={() => handleNavClick('home')}
                        >
                            Home
                        </li>
                        <li
                            className={isActive('services')}
                            onClick={() => handleNavClick('services')}
                        >
                            Services
                        </li>
                        <li
                            className={isActive('lists')}
                            onClick={() => handleNavClick('lists')}
                        >
                            Lists
                        </li>
                        <li
                            className={isActive('settings')}
                            onClick={() => handleNavClick('settings')}
                        >
                            Settings
                        </li>
                    </ul>
                </nav>
            </aside>

            <main className="main-content">
                {renderView()}
            </main>
        </div>
    );
}
