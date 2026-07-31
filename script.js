const DISCORD_ID = "1040583829607428146";

// Lanyard Discord Verisi Çekme
async function getDiscordData() {
    try {
        const response = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`);
        const result = await response.json();

        if (!result.success) return;

        const data = result.data;
        const user = data.discord_user;

        // Avatar
        const avatarEl = document.querySelector(".discord-avatar");
        if (avatarEl && user.avatar) {
            const ext = user.avatar.startsWith("a_") ? "gif" : "png";
            avatarEl.src = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${ext}?size=256`;
        }

        // Isim
        const usernameEl = document.querySelector(".name-line h3");
        if (usernameEl) usernameEl.textContent = user.global_name || user.username;

        const handleEl = document.querySelector(".user-handle");
        if (handleEl) handleEl.textContent = `@${user.username}`;

        // Durum (Online/Offline)
        const statusEl = document.querySelector(".status-indicator");
        if (statusEl) statusEl.className = `status-indicator ${data.discord_status}`;

        // Spotify
        const spotifyCard = document.querySelector(".spotify-card");
        if (data.listening_to_spotify && data.spotify) {
            if (spotifyCard) spotifyCard.style.display = "block";
            const titleEl = document.querySelector(".track-title");
            const artistEl = document.querySelector(".track-artist");
            if (titleEl) titleEl.textContent = data.spotify.song;
            if (artistEl) artistEl.textContent = data.spotify.artist;

            if (data.spotify.timestamps) {
                const total = data.spotify.timestamps.end - data.spotify.timestamps.start;
                const current = Date.now() - data.spotify.timestamps.start;
                const fillBar = document.querySelector(".progress-fill");
                if (fillBar) fillBar.style.width = `${Math.min(100, Math.max(0, (current / total) * 100))}%`;
            }
        } else {
            if (spotifyCard) spotifyCard.style.display = "none";
        }

    } catch (err) {
        console.error("Lanyard verisi çekilemedi:", err);
    }
}

// SSS Accordion Mantığı
function setupFAQ() {
    const faqQuestions = document.querySelectorAll(".faq-question");

    faqQuestions.forEach(question => {
        question.addEventListener("click", () => {
            const faqItem = question.parentElement;
            
            // Diğer açık olanları kapat
            document.querySelectorAll(".faq-item").forEach(item => {
                if (item !== faqItem) item.classList.remove("active");
            });

            // Tıklananı aç/kapat
            faqItem.classList.toggle("active");
        });
    });
}

document.addEventListener("DOMContentLoaded", () => {
    getDiscordData();
    setInterval(getDiscordData, 5000);
    setupFAQ();
});