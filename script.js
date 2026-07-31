document.addEventListener('DOMContentLoaded', () => {

    // =========================================================
    // AYARLAR
    // =========================================================

    const DISCORD_ID = '1040583829607428146';


    // =========================================================
    // TEMA
    // =========================================================

    const colorDots = document.querySelectorAll('.color-dot');

    colorDots.forEach(dot => {

        dot.addEventListener('click', () => {

            colorDots.forEach(d => {
                d.classList.remove('active');
            });

            dot.classList.add('active');

            const selectedTheme = dot.dataset.color;

            document.body.setAttribute(
                'data-theme',
                selectedTheme
            );

        });

    });


    // =========================================================
    // HTML ELEMENTLERİ
    // =========================================================

    const spotifyElement =
        document.getElementById('spotify-activity');

    const gameElement =
        document.getElementById('game-activity');

    const spotifyDot =
        document.getElementById('spotify-status-dot');

    const activityDot =
        document.getElementById('activity-status-dot');

    const statusText =
        document.querySelector('.status-text');

    const statusIndicators =
        document.querySelectorAll('.status-indicator');

    const customStatusElement =
        document.querySelector('.custom-status-box span');


    // =========================================================
    // DURUM RENKLERİ
    // =========================================================

    const statusMap = {

        online: {
            text: 'Çevrimiçi',
            className: 'online',
            color: '#22c55e'
        },

        idle: {
            text: 'Boşta',
            className: 'idle',
            color: '#f59e0b'
        },

        dnd: {
            text: 'Rahatsız Etmeyin',
            className: 'dnd',
            color: '#f43f5e'
        },

        offline: {
            text: 'Çevrimdışı',
            className: 'offline',
            color: '#71717a'
        }

    };


    // =========================================================
    // AVATAR
    // =========================================================

    function updateAvatar(presence) {

        const user = presence?.discord_user;

        if (!user || !user.avatar) {
            return;
        }

        const extension =
            user.avatar.startsWith('a_')
                ? 'gif'
                : 'png';

        const avatarUrl =
            `https://cdn.discordapp.com/avatars/${DISCORD_ID}/${user.avatar}.${extension}?size=512`;


        document
            .querySelectorAll(
                '.hero-avatar, .profile-avatar-img'
            )
            .forEach(img => {

                img.src = avatarUrl;

            });

    }


    // =========================================================
    // DISCORD DURUMU
    // =========================================================

    function updateStatus(presence) {

        const status =
            statusMap[presence?.discord_status]
            || statusMap.offline;


        statusIndicators.forEach(indicator => {

            indicator.className =
                `status-indicator ${status.className}`;

        });


        if (statusText) {

            statusText.innerHTML = `
                <i
                    class="fa-solid fa-circle"
                    style="color:${status.color}"
                ></i>
                ${status.text}
            `;

        }

    }


    // =========================================================
    // SPOTIFY
    // =========================================================

    function updateSpotify(presence) {

        if (!spotifyElement) {
            return;
        }


        const spotify =
            presence?.spotify;


        const isListening =
            presence?.listening_to_spotify === true
            && spotify != null;


        if (isListening) {

            const song =
                escapeHtml(spotify.song || 'Bilinmeyen şarkı');

            const artist =
                escapeHtml(spotify.artist || 'Bilinmeyen sanatçı');

            spotifyElement.innerHTML = `
                <div class="spotify-playing">

                    <div class="spotify-song">
                        <span class="spotify-listening">
                            Şu an dinliyor
                        </span>

                        <strong>
                            ${song}
                        </strong>
                    </div>

                    <div class="spotify-artist">
                        ${artist}
                    </div>

                </div>
            `;


            if (spotifyDot) {
                spotifyDot.classList.add('active');
            }

        } else {

            spotifyElement.innerHTML =
                'Şu an bir şey dinlemiyor';


            if (spotifyDot) {
                spotifyDot.classList.remove('active');
            }

        }

    }


    // =========================================================
    // OYUN / AKTİVİTE
    // =========================================================

    function updateGameActivity(presence) {

        if (!gameElement) {
            return;
        }


        const activities =
            Array.isArray(presence?.activities)
                ? presence.activities
                : [];


        /*
            Discord activity türleri:

            0 = Playing
            1 = Streaming
            2 = Listening
            3 = Watching
            4 = Custom Status
            5 = Competing
        */


        const gameActivity =
            activities.find(activity => {

                return (
                    activity.type !== 2 &&
                    activity.type !== 4
                );

            });


        if (!gameActivity) {

            gameElement.textContent =
                'Aktif aktivite yok';


            if (activityDot) {
                activityDot.classList.remove('active');
            }

            return;
        }


        let html = '';


        if (gameActivity.name) {

            html += `
                <strong>
                    ${escapeHtml(gameActivity.name)}
                </strong>
            `;

        }


        if (gameActivity.details) {

            html += `
                <span>
                    — ${escapeHtml(gameActivity.details)}
                </span>
            `;

        }


        if (gameActivity.state) {

            html += `
                <div class="activity-state">
                    ${escapeHtml(gameActivity.state)}
                </div>
            `;

        }


        gameElement.innerHTML =
            html || 'Aktif aktivite var';


        if (activityDot) {
            activityDot.classList.add('active');
        }

    }


    // =========================================================
    // CUSTOM STATUS
    // =========================================================

    function updateCustomStatus(presence) {

        if (!customStatusElement) {
            return;
        }


        const activities =
            Array.isArray(presence?.activities)
                ? presence.activities
                : [];


        const customStatus =
            activities.find(
                activity => activity.type === 4
            );


        if (
            customStatus &&
            customStatus.state
        ) {

            customStatusElement.textContent =
                `"${customStatus.state}"`;

        } else {

            customStatusElement.textContent =
                '"Herkes her şeyin bedelini öder."';

        }

    }


    // =========================================================
    // TÜM VERİYİ GÜNCELLE
    // =========================================================

    function updatePresenceData(presence) {

        if (!presence) {
            return;
        }


        console.log(
            'Lanyard Presence:',
            presence
        );


        updateAvatar(presence);

        updateStatus(presence);

        updateSpotify(presence);

        updateGameActivity(presence);

        updateCustomStatus(presence);

    }


    // =========================================================
    // HTML GÜVENLİK
    // =========================================================

    function escapeHtml(value) {

        return String(value)
            .replaceAll('&', '&amp;')
            .replaceAll('<', '&lt;')
            .replaceAll('>', '&gt;')
            .replaceAll('"', '&quot;')
            .replaceAll("'", '&#039;');

    }


    // =========================================================
    // LANYARD REST API
    // =========================================================

    async function fetchInitialData() {

        try {

            console.log(
                'Lanyard REST bağlantısı kuruluyor...'
            );


            const response =
                await fetch(
                    `https://api.lanyard.rest/v1/users/${DISCORD_ID}`
                );


            if (!response.ok) {

                throw new Error(
                    `HTTP ${response.status}`
                );

            }


            const json =
                await response.json();


            console.log(
                'Lanyard REST sonucu:',
                json
            );


            if (
                json.success &&
                json.data
            ) {

                updatePresenceData(
                    json.data
                );

            } else {

                console.error(
                    'Lanyard kullanıcı verisi bulunamadı.'
                );

            }

        } catch (error) {

            console.error(
                'Lanyard REST Hatası:',
                error
            );

        }

    }


    // =========================================================
    // LANYARD WEBSOCKET
    // =========================================================

    let heartbeatInterval = null;


    function connectLanyard() {

        console.log(
            'Lanyard WebSocket bağlanıyor...'
        );


        const socket =
            new WebSocket(
                'wss://api.lanyard.rest/socket'
            );


        socket.addEventListener(
            'open',
            () => {

                console.log(
                    'Lanyard WebSocket bağlandı.'
                );


                socket.send(
                    JSON.stringify({
                        op: 2,
                        d: {
                            subscribe_to_id:
                                DISCORD_ID
                        }
                    })
                );

            }
        );


        socket.addEventListener(
            'message',
            event => {

                try {

                    const data =
                        JSON.parse(event.data);


                    // HELLO
                    if (data.op === 1) {

                        if (heartbeatInterval) {
                            clearInterval(
                                heartbeatInterval
                            );
                        }


                        heartbeatInterval =
                            setInterval(() => {

                                if (
                                    socket.readyState ===
                                    WebSocket.OPEN
                                ) {

                                    socket.send(
                                        JSON.stringify({
                                            op: 3
                                        })
                                    );

                                }

                            }, data.d.heartbeat_interval);

                        return;

                    }


                    // PRESENCE
                    if (
                        data.t === 'INIT_STATE' ||
                        data.t === 'PRESENCE_UPDATE'
                    ) {

                        updatePresenceData(
                            data.d
                        );

                    }

                } catch (error) {

                    console.error(
                        'WebSocket veri hatası:',
                        error
                    );

                }

            }
        );


        socket.addEventListener(
            'close',
            () => {

                console.warn(
                    'Lanyard WebSocket kapandı. Yeniden bağlanılıyor...'
                );


                if (heartbeatInterval) {

                    clearInterval(
                        heartbeatInterval
                    );

                    heartbeatInterval = null;

                }


                setTimeout(
                    connectLanyard,
                    3000
                );

            }
        );


        socket.addEventListener(
            'error',
            error => {

                console.error(
                    'Lanyard WebSocket hatası:',
                    error
                );

            }
        );

    }


    // =========================================================
    // BAŞLAT
    // =========================================================

    fetchInitialData();

    connectLanyard();

});
