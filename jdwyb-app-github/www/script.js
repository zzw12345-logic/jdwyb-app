// 导航栏滚动效果
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
});

// 平滑滚动
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// 导航链接激活状态
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// AI客服功能
const chatButton = document.getElementById('chatButton');
const chatWindow = document.getElementById('chatWindow');
const chatClose = document.getElementById('chatClose');
const chatInput = document.getElementById('chatInput');
const chatSend = document.getElementById('chatSend');
const chatMessages = document.getElementById('chatMessages');
const quickReplies = document.querySelectorAll('.quick-reply');

// API配置 - 使用用户提供的API Key
const API_KEY = 'ark-86a0772e-a8c2-4f6a-b881-cebdad11e2ea-94e19';
const API_URL = 'https://ark.cn-beijing.volces.com/api/v3/chat/completions';

// 打开/关闭聊天窗口
chatButton.addEventListener('click', () => {
    chatWindow.classList.toggle('active');
    if (chatWindow.classList.contains('active')) {
        chatInput.focus();
    }
});

chatClose.addEventListener('click', () => {
    chatWindow.classList.remove('active');
});

// 点击窗口外部关闭
document.addEventListener('click', (e) => {
    if (!e.target.closest('.ai-chat-widget')) {
        chatWindow.classList.remove('active');
    }
});

// 添加消息到聊天窗口
function addMessage(content, isUser = false) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user' : 'bot'}`;
    
    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'message-avatar';
    avatarDiv.innerHTML = `<i class="fas ${isUser ? 'fa-user' : 'fa-robot'}"></i>`;
    
    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    
    if (typeof content === 'string') {
        contentDiv.innerHTML = `<p>${content}</p>`;
    } else {
        contentDiv.appendChild(content);
    }
    
    messageDiv.appendChild(avatarDiv);
    messageDiv.appendChild(contentDiv);
    chatMessages.appendChild(messageDiv);
    
    // 滚动到底部
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// 添加加载动画
function addLoadingMessage() {
    const loadingDiv = document.createElement('div');
    loadingDiv.className = 'message bot loading-message';
    loadingDiv.innerHTML = `
        <div class="message-avatar">
            <i class="fas fa-robot"></i>
        </div>
        <div class="message-content">
            <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;
    chatMessages.appendChild(loadingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    return loadingDiv;
}

// 移除加载动画
function removeLoadingMessage() {
    const loadingMessage = document.querySelector('.loading-message');
    if (loadingMessage) {
        loadingMessage.remove();
    }
}

// 调用AI API
async function callAIAPI(message) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: 'model: 'ep-20260510195148-xp4v4',
                messages: [
                    {
                        role: 'system',
                        content: `你是接单无忧宝的AI智能助手。接单无忧宝是专为外卖小哥、网约车司机等灵活工作者设计的智能工具，提供以下核心服务：

1. **收入预测**：整合美团、滴滴等多平台数据，AI预测收入趋势，准确率达78%
2. **风险预警**：收入异常立即报警，推荐爆单区域和黄金时段
3. **按单保险**：每单仅需0.5-1.5元，接单自动激活，包含意外伤害、误工补贴等保障

你的职责是：
- 友好、专业地回答用户关于产品功能、保险方案、收入预测的问题
- 帮助用户了解如何使用接单无忧宝提升收入和保障安全
- 解答理赔流程和保险条款相关问题
- 用通俗易懂的语言解释复杂的保险和数据分析概念

请用中文回答，语气亲切友好，像一位贴心的助手。`
                    },
                    {
                        role: 'user',
                        content: message
                    }
                ],
                temperature: 0.7,
                max_tokens: 1000
            })
        });

        if (!response.ok) {
            throw new Error('API请求失败');
        }

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error('AI API调用失败:', error);
        return getFallbackResponse(message);
    }
}

// 备用回复（当API不可用时）
function getFallbackResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('价格') || lowerMessage.includes('收费') || lowerMessage.includes('多少钱')) {
        return `我们的保险方案有三种：

<b>基础保障</b>：¥0.5/单
• 意外伤害医疗 ¥5000
• 误工补贴 ¥100/天

<b>全面保障（推荐）</b>：¥1.0/单
• 意外伤害医疗 ¥20000
• 误工补贴 ¥200/天
• 第三方责任险 ¥50000

<b>雨天加强</b>：¥1.5/单
• 雨天意外医疗 ¥50000
• 误工补贴 ¥300/天
• 滑倒摔伤专项保障

按单计费，用多少付多少，非常灵活！`;
    }
    
    if (lowerMessage.includes('理赔') || lowerMessage.includes('赔偿') || lowerMessage.includes('报销')) {
        return `理赔流程非常简单：

<b>1. 事故发生</b>
遭遇意外立即在APP报案

<b>2. 提交材料</b>
上传医疗证明和事故照片

<b>3. 快速审核</b>
24小时内完成理赔审核

<b>4. 赔款到账</b>
审核通过立即打款

我们承诺24小时内完成审核，让您安心工作！`;
    }
    
    if (lowerMessage.includes('预测') || lowerMessage.includes('收入') || lowerMessage.includes('赚钱')) {
        return `我们的AI收入预测系统可以：

• <b>提前3天预测</b>收入变化，准确率达78%
• 分析<b>天气、节假日</b>等因素对收入的影响
• 推荐<b>爆单区域</b>和<b>黄金时段</b>
• 收入异常时<b>立即预警</b>，建议调整策略

比如会提醒您："下周商圈有3天暴雨，预计少赚200块，建议开启雨天接单攻略"`;
    }
    
    if (lowerMessage.includes('是什么') || lowerMessage.includes('介绍')) {
        return `接单无忧宝是专为外卖小哥、网约车司机等灵活工作者设计的智能工具！

我们的核心服务：
• 📊 <b>收入预测</b> - AI预测收入趋势，提前规划工作
• 🔔 <b>风险预警</b> - 收入异常提醒，推荐最佳接单区域
• 🛡️ <b>按单保险</b> - 每单0.5元起，接单自动激活保障

让灵活工作更稳定，让保障更贴心！`;
    }
    
    return `感谢您的咨询！我是接单无忧宝的AI助手，可以帮您：

• 了解收入预测功能
• 咨询保险方案和理赔流程
• 解答使用中的任何问题

请问您想了解哪方面的信息呢？`;
}

// 发送消息
async function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;
    
    // 添加用户消息
    addMessage(message, true);
    chatInput.value = '';
    
    // 显示加载动画
    const loadingDiv = addLoadingMessage();
    
    // 调用AI API
    const response = await callAIAPI(message);
    
    // 移除加载动画并显示回复
    removeLoadingMessage();
    
    // 将回复中的换行符转换为HTML
    const formattedResponse = response.replace(/\n/g, '<br>');
    const contentDiv = document.createElement('div');
    contentDiv.innerHTML = formattedResponse;
    addMessage(contentDiv, false);
}

// 发送按钮点击
chatSend.addEventListener('click', sendMessage);

// 回车发送
chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// 快捷回复
quickReplies.forEach(reply => {
    reply.addEventListener('click', () => {
        const question = reply.getAttribute('data-question');
        chatInput.value = question;
        sendMessage();
    });
});

// 动画效果 - 滚动时显示元素
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// 观察所有需要动画的元素
document.querySelectorAll('.feature-card, .insurance-card, .testimonial-card, .income-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// 图表动画
document.querySelectorAll('.bar').forEach((bar, index) => {
    const height = bar.style.height;
    bar.style.height = '0';
    setTimeout(() => {
        bar.style.transition = 'height 1s ease';
        bar.style.height = height;
    }, index * 100);
});

// 数字计数动画
function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        element.textContent = value + (element.dataset.suffix || '');
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// 观察统计数据
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const text = stat.textContent;
                const num = parseInt(text);
                if (!isNaN(num)) {
                    const suffix = text.replace(num.toString(), '');
                    stat.dataset.suffix = suffix;
                    animateValue(stat, 0, num, 2000);
                }
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.hero-stats, .about-stats').forEach(el => {
    statsObserver.observe(el);
});

// 添加打字指示器样式
const style = document.createElement('style');
style.textContent = `
    .typing-indicator {
        display: flex;
        gap: 4px;
        padding: 4px 0;
    }
    
    .typing-indicator span {
        width: 8px;
        height: 8px;
        background: #999;
        border-radius: 50%;
        animation: typing 1.4s infinite ease-in-out both;
    }
    
    .typing-indicator span:nth-child(1) {
        animation-delay: -0.32s;
    }
    
    .typing-indicator span:nth-child(2) {
        animation-delay: -0.16s;
    }
    
    @keyframes typing {
        0%, 80%, 100% {
            transform: scale(0);
        }
        40% {
            transform: scale(1);
        }
    }
`;
document.head.appendChild(style);

// 移动端菜单切换
const hamburger = document.querySelector('.hamburger');
const navLinksContainer = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinksContainer.classList.toggle('active');
});

// 按钮点击效果
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// 添加涟漪动画样式
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

console.log('接单无忧宝网站已加载完成！');
console.log('AI客服已集成，API Key已配置');

// ========== PWA - 添加到桌面功能 ==========
let deferredPrompt;
const btnInstall = document.getElementById('btnInstall');
const btnInstallCta = document.getElementById('btnInstallCta');

// 监听beforeinstallprompt事件
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    console.log('PWA安装提示已捕获');
});

// 安装函数
async function installPWA() {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            showToast('应用已添加到桌面！', 'success');
        }
        deferredPrompt = null;
    } else if (window.matchMedia('(display-mode: standalone)').matches) {
        showToast('应用已经在桌面上了', 'info');
    } else {
        // 浏览器不支持或已安装，显示手动添加指南
        showInstallGuide();
    }
}

// 显示安装指南
function showInstallGuide() {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    
    let guideHTML = '';
    if (isIOS) {
        guideHTML = `
            <div style="text-align:left;line-height:1.8;">
                <p><b>iPhone/iPad添加方法：</b></p>
                <p>1. 点击Safari底部的 <i class="fas fa-share-square" style="color:#2563eb;"></i> 分享按钮</p>
                <p>2. 向上滑动，找到"添加到主屏幕"</p>
                <p>3. 点击"添加"即可</p>
            </div>
        `;
    } else if (isAndroid) {
        guideHTML = `
            <div style="text-align:left;line-height:1.8;">
                <p><b>安卓手机添加方法：</b></p>
                <p>1. 点击浏览器菜单 <i class="fas fa-ellipsis-v" style="color:#2563eb;"></i></p>
                <p>2. 选择"添加到主屏幕"或"安装应用"</p>
                <p>3. 点击"添加"即可</p>
            </div>
        `;
    } else {
        guideHTML = `
            <div style="text-align:left;line-height:1.8;">
                <p><b>添加到桌面方法：</b></p>
                <p>1. 点击浏览器菜单（右上角⋮）</p>
                <p>2. 选择"安装应用"或"添加到主屏幕"</p>
                <p>3. 按提示完成添加</p>
            </div>
        `;
    }
    
    showModal('添加到桌面', guideHTML);
}

// 简单的模态框
function showModal(title, content) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay active';
    modal.innerHTML = `
        <div class="modal" style="max-width:400px;">
            <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">
                <i class="fas fa-times"></i>
            </button>
            <div class="modal-header">
                <h2>${title}</h2>
            </div>
            <div style="padding:1rem 0;">${content}</div>
            <button class="btn btn-primary btn-block" onclick="this.closest('.modal-overlay').remove()">
                知道了
            </button>
        </div>
    `;
    modal.addEventListener('click', e => {
        if (e.target === modal) modal.remove();
    });
    document.body.appendChild(modal);
}

// 绑定安装按钮
if (btnInstall) btnInstall.addEventListener('click', installPWA);
if (btnInstallCta) btnInstallCta.addEventListener('click', installPWA);

// 监听appinstalled事件
window.addEventListener('appinstalled', () => {
    showToast('应用安装成功！', 'success');
    deferredPrompt = null;
});

// 注册Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('Service Worker注册成功:', registration.scope);
            })
            .catch(error => {
                console.log('Service Worker注册失败:', error);
            });
    });
}

// ========== 登录/注册功能 ==========
const loginModal = document.getElementById('loginModal');
const registerModal = document.getElementById('registerModal');
const navButtons = document.getElementById('navButtons');
const navUser = document.getElementById('navUser');

// 打开/关闭弹窗
function openModal(modal) { modal.classList.add('active'); }
function closeModal(modal) { modal.classList.remove('active'); }

document.getElementById('btnLogin').addEventListener('click', () => openModal(loginModal));
document.getElementById('btnRegister').addEventListener('click', () => openModal(registerModal));
document.getElementById('loginClose').addEventListener('click', () => closeModal(loginModal));
document.getElementById('registerClose').addEventListener('click', () => closeModal(registerModal));

// 点击遮罩关闭
loginModal.addEventListener('click', e => { if (e.target === loginModal) closeModal(loginModal); });
registerModal.addEventListener('click', e => { if (e.target === registerModal) closeModal(registerModal); });

// 切换登录/注册
document.getElementById('switchToRegister').addEventListener('click', e => {
    e.preventDefault();
    closeModal(loginModal);
    setTimeout(() => openModal(registerModal), 200);
});
document.getElementById('switchToLogin').addEventListener('click', e => {
    e.preventDefault();
    closeModal(registerModal);
    setTimeout(() => openModal(loginModal), 200);
});

// ESC关闭弹窗
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        closeModal(loginModal);
        closeModal(registerModal);
    }
});

// Toast提示
function showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icons = { success: 'fa-check-circle', error: 'fa-exclamation-circle', info: 'fa-info-circle' };
    toast.innerHTML = `<i class="fas ${icons[type] || icons.info}"></i><span>${message}</span>`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
}

// 密码显示/隐藏
document.querySelectorAll('.toggle-password').forEach(btn => {
    btn.addEventListener('click', () => {
        const input = document.getElementById(btn.dataset.target);
        const icon = btn.querySelector('i');
        if (input.type === 'password') {
            input.type = 'text';
            icon.classList.replace('fa-eye', 'fa-eye-slash');
        } else {
            input.type = 'password';
            icon.classList.replace('fa-eye-slash', 'fa-eye');
        }
    });
});

// 密码强度检测
const regPassword = document.getElementById('regPassword');
const strengthFill = document.getElementById('strengthFill');
const strengthText = document.getElementById('strengthText');

regPassword.addEventListener('input', () => {
    const val = regPassword.value;
    let score = 0;
    if (val.length >= 6) score++;
    if (val.length >= 10) score++;
    if (/[A-Z]/.test(val)) score++;
    if (/[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;

    strengthFill.className = 'strength-fill';
    if (val.length === 0) {
        strengthText.textContent = '';
    } else if (score <= 2) {
        strengthFill.classList.add('weak');
        strengthText.textContent = '弱';
        strengthText.style.color = '#ef4444';
    } else if (score <= 3) {
        strengthFill.classList.add('medium');
        strengthText.textContent = '中';
        strengthText.style.color = '#f59e0b';
    } else {
        strengthFill.classList.add('strong');
        strengthText.textContent = '强';
        strengthText.style.color = '#10b981';
    }
});

// 清除错误状态
document.querySelectorAll('.form-group input, .form-group select').forEach(input => {
    input.addEventListener('input', () => {
        input.classList.remove('error');
        const errorEl = input.closest('.form-group').querySelector('.form-error');
        if (errorEl) errorEl.textContent = '';
    });
});

// 验证工具
function setError(inputId, errorId, msg) {
    document.getElementById(inputId).classList.add('error');
    document.getElementById(errorId).textContent = msg;
    return false;
}
function clearError(inputId, errorId) {
    document.getElementById(inputId).classList.remove('error');
    document.getElementById(errorId).textContent = '';
}
function isValidPhone(phone) { return /^1[3-9]\d{9}$/.test(phone); }

// 用户数据存储
function getUsers() {
    return JSON.parse(localStorage.getItem('jdwyb_users') || '[]');
}
function saveUsers(users) {
    localStorage.setItem('jdwyb_users', JSON.stringify(users));
}
function setCurrentUser(user) {
    localStorage.setItem('jdwyb_current', JSON.stringify(user));
}
function getCurrentUser() {
    return JSON.parse(localStorage.getItem('jdwyb_current') || 'null');
}
function logoutUser() {
    localStorage.removeItem('jdwyb_current');
}

// 更新导航栏状态
function updateNavUI() {
    const user = getCurrentUser();
    if (user) {
        navButtons.style.display = 'none';
        navUser.style.display = 'flex';
        document.getElementById('userName').textContent = user.name;
        document.getElementById('userAvatar').innerHTML = `<i class="fas fa-user"></i>`;
    } else {
        navButtons.style.display = 'flex';
        navUser.style.display = 'none';
    }
}

// 注册
document.getElementById('registerForm').addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;

    const name = document.getElementById('regName').value.trim();
    const phone = document.getElementById('regPhone').value.trim();
    const role = document.getElementById('regRole').value;
    const password = document.getElementById('regPassword').value;
    const confirm = document.getElementById('regConfirm').value;
    const agree = document.getElementById('agreeTerms').checked;

    // 验证
    if (!name) valid = setError('regName', 'regNameError', '请输入昵称');
    else clearError('regName', 'regNameError');

    if (!phone) valid = setError('regPhone', 'regPhoneError', '请输入手机号');
    else if (!isValidPhone(phone)) valid = setError('regPhone', 'regPhoneError', '手机号格式不正确');
    else clearError('regPhone', 'regPhoneError');

    if (!role) valid = setError('regRole', 'regRoleError', '请选择职业');
    else clearError('regRole', 'regRoleError');

    if (!password) valid = setError('regPassword', 'regPasswordError', '请设置密码');
    else if (password.length < 6) valid = setError('regPassword', 'regPasswordError', '密码至少6位');
    else clearError('regPassword', 'regPasswordError');

    if (!confirm) valid = setError('regConfirm', 'regConfirmError', '请确认密码');
    else if (password !== confirm) valid = setError('regConfirm', 'regConfirmError', '两次密码不一致');
    else clearError('regConfirm', 'regConfirmError');

    if (!agree) {
        showToast('请先同意用户协议和隐私政策', 'error');
        return;
    }

    if (!valid) return;

    // 检查手机号是否已注册
    const users = getUsers();
    if (users.find(u => u.phone === phone)) {
        setError('regPhone', 'regPhoneError', '该手机号已注册');
        return;
    }

    // 保存用户
    users.push({ name, phone, role, password, createdAt: new Date().toISOString() });
    saveUsers(users);

    showToast('注册成功！请登录', 'success');
    closeModal(registerModal);
    document.getElementById('registerForm').reset();
    strengthFill.className = 'strength-fill';
    strengthText.textContent = '';

    setTimeout(() => openModal(loginModal), 300);
});

// 登录
document.getElementById('loginForm').addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;

    const phone = document.getElementById('loginPhone').value.trim();
    const password = document.getElementById('loginPassword').value;

    if (!phone) valid = setError('loginPhone', 'loginPhoneError', '请输入手机号');
    else if (!isValidPhone(phone)) valid = setError('loginPhone', 'loginPhoneError', '手机号格式不正确');
    else clearError('loginPhone', 'loginPhoneError');

    if (!password) valid = setError('loginPassword', 'loginPasswordError', '请输入密码');
    else clearError('loginPassword', 'loginPasswordError');

    if (!valid) return;

    // 查找用户
    const users = getUsers();
    const user = users.find(u => u.phone === phone && u.password === password);

    if (!user) {
        showToast('手机号或密码错误', 'error');
        return;
    }

    // 登录成功
    setCurrentUser(user);
    updateNavUI();
    closeModal(loginModal);
    document.getElementById('loginForm').reset();
    showToast(`欢迎回来，${user.name}！`, 'success');
});

// 退出登录
document.getElementById('btnLogout').addEventListener('click', () => {
    logoutUser();
    updateNavUI();
    showToast('已退出登录', 'info');
});

// 页面加载时检查登录状态
updateNavUI();
