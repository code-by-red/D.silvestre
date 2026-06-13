// Configuração da API do backend
const API_URL = "http://localhost:3000/api/mural";

// Comentários padrão
const defaultComments = [
    { name: "Cria de Rondônia", city: "Pimenta Bueno - RO", msg: "Douglas representando Pimenta Bueno de um jeito inacreditável no underground mundial! Orgulho demais ⚡️", date: "Há 12 minutos" },
    { name: "Submundo Fan", city: "São Paulo - SP", msg: "O set dele na Submundo 808 foi absurdo. 'Sem moralismo' é uma obra de arte do minimalismo cru.", date: "Há 2 horas" },
    { name: "DJ K", city: "São Paulo - SP", msg: "A deconstrução que ele faz nas caixas de ferro trouxe uma roupagem elegante que o funk precisava.", date: "Há 1 dia" }
];

window.addEventListener('load', () => {
    loadGuestbook();
});

// Album sleeve modal handler
function showAlbumModal(title, tracklist) {
    document.getElementById('modal-title').innerText = title;
    const container = document.getElementById('modal-tracks');
    container.innerHTML = '';
    
    tracklist.forEach((track, index) => {
        const item = document.createElement('div');
        item.className = "flex items-center justify-between py-2 border-b border-zinc-900 text-sm";
        item.innerHTML = `
            <div class="flex items-center space-x-3">
                <span class="text-xs font-mono text-zinc-500 font-bold">${(index+1).toString().padStart(2, '0')}</span>
                <span class="text-white font-medium">${track}</span>
            </div>
            <span class="text-[10px] font-mono text-cyber-acid font-bold">FAIXA REAL</span>
        `;
        container.appendChild(item);
    });

    const modal = document.getElementById('album-modal');
    modal.classList.remove('opacity-0', 'pointer-events-none');
}

function closeAlbumModal() {
    const modal = document.getElementById('album-modal');
    modal.classList.add('opacity-0', 'pointer-events-none');
}

// Custom non-alert popups
function showCustomPopup(title, msg) {
    const popup = document.getElementById('popup-box');
    document.getElementById('popup-title').innerText = title;
    document.getElementById('popup-message').innerText = msg;

    popup.classList.remove('translate-y-20', 'opacity-0');
    popup.classList.add('translate-y-0', 'opacity-100');

    setTimeout(() => {
        popup.classList.remove('translate-y-0', 'opacity-100');
        popup.classList.add('translate-y-20', 'opacity-0');
    }, 4000);
}

// Guestbook data handlers
async function loadGuestbook() {
    const container = document.getElementById('mural-container');
    
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        
        if (data.messages && data.messages.length > 0) {
            renderComments(data.messages);
        } else {
            renderComments(defaultComments);
        }
    } catch (error) {
        console.error('Erro ao carregar mural:', error);
        // Fallback para localStorage se o backend não estiver disponível
        let stored = localStorage.getItem('dsilvestre_mural_real_v1');
        let list = [];
        if (stored) {
            list = JSON.parse(stored);
        } else {
            list = defaultComments;
            localStorage.setItem('dsilvestre_mural_real_v1', JSON.stringify(list));
        }
        renderComments(list);
    }
}

function renderComments(list) {
    const container = document.getElementById('mural-container');
    container.innerHTML = '';
    list.forEach(c => {
        const commentEl = document.createElement('div');
        commentEl.className = 'bg-zinc-950 border border-zinc-900 rounded-2xl p-5 hover:border-zinc-800 transition-colors duration-300';
        commentEl.innerHTML = `
            <div class="flex items-center justify-between">
                <div>
                    <span class="font-display font-extrabold text-white text-base">${escapeHTML(c.name)}</span>
                    <span class="text-xs text-cyber-acid font-mono ml-2 font-semibold">• ${escapeHTML(c.city)}</span>
                </div>
                <span class="text-[10px] text-zinc-500 font-mono">${c.date}</span>
            </div>
            <p class="text-gray-300 text-sm mt-3 font-light leading-relaxed">${escapeHTML(c.msg)}</p>
        `;
        container.appendChild(commentEl);
    });
}

async function submitComment(e) {
    e.preventDefault();
    const name = document.getElementById('form-name').value.trim();
    const city = document.getElementById('form-city').value.trim();
    const msg = document.getElementById('form-msg').value.trim();

    if (!name || !city || !msg) return;

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nome: name, cidade: city, mensagem: msg })
        });

        if (response.ok) {
            loadGuestbook();
            document.getElementById('form-name').value = '';
            document.getElementById('form-city').value = '';
            document.getElementById('form-msg').value = '';
            showCustomPopup("Mural Atualizado", "Seu salve de fã foi gravado e já está público no mural!");
        } else {
            throw new Error('Erro ao enviar comentário');
        }
    } catch (error) {
        console.error('Erro ao enviar comentário:', error);
        // Fallback para localStorage
        const newComment = {
            name: name,
            city: city,
            msg: msg,
            date: "Agora mesmo"
        };

        let stored = localStorage.getItem('dsilvestre_mural_real_v1');
        let list = stored ? JSON.parse(stored) : [];
        list.unshift(newComment);
        
        localStorage.setItem('dsilvestre_mural_real_v1', JSON.stringify(list));
        loadGuestbook();

        document.getElementById('form-name').value = '';
        document.getElementById('form-city').value = '';
        document.getElementById('form-msg').value = '';

        showCustomPopup("Mural Atualizado (Local)", "Seu salve foi salvo localmente. O backend pode não estar disponível.");
    }
}

async function clearGuestbook() {
    try {
        const response = await fetch(API_URL, {
            method: 'DELETE'
        });

        if (response.ok) {
            loadGuestbook();
            showCustomPopup("Histórico Redefinido", "O mural foi limpo com sucesso.");
        } else {
            throw new Error('Erro ao limpar mural');
        }
    } catch (error) {
        console.error('Erro ao limpar mural:', error);
        // Fallback para localStorage
        localStorage.removeItem('dsilvestre_mural_real_v1');
        loadGuestbook();
        showCustomPopup("Histórico Redefinido (Local)", "O mural local foi resetado.");
    }
}

function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}

// Mobile Menu Button toggle handler
const mobileBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const menuIcon = document.getElementById('menu-icon');

mobileBtn.addEventListener('click', () => {
    if (mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.remove('hidden');
        menuIcon.className = "fas fa-times text-xl";
    } else {
        mobileMenu.classList.add('hidden');
        menuIcon.className = "fas fa-bars text-xl";
    }
});
