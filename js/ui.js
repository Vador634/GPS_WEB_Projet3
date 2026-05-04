/* ============================
   UI.JS - USER INTERFACE UTILITIES
   ============================
   
   Provides reusable UI components:
   - Toast Notifications: Non-blocking messages with optional actions
   - Confirmation Dialogs: Promise-based user confirmations
   - Focus Trap: Accessibility helper for modal dialogs
   
   Dependencies:
   - CSS: toast, toast--, toast__ classes from style.css
   
   ============================ */

/* ========================
   TOAST NOTIFICATIONS
   ========================
   
   Displays temporary messages to the user.
   Features:
   - Type variants: 'info', 'success', 'warning'
   - Optional action buttons
   - Auto-dismiss with configurable timeout
   - Pause auto-dismiss on hover
   */

const toastContainerId = 'toast-container';

function createToastContainer() {
    if (document.getElementById(toastContainerId)) return;
    const container = document.createElement('div');
    container.id = toastContainerId;
    container.setAttribute('aria-live', 'polite');
    container.style.position = 'fixed';
    container.style.right = '20px';
    container.style.bottom = '20px';
    container.style.zIndex = '2000';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.gap = '10px';
    document.body.appendChild(container);
}

function showToast(message, {type='info', timeout=3500, actions=[]} = {}) {
    createToastContainer();
    const container = document.getElementById(toastContainerId);
    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.tabIndex = 0;
    toast.setAttribute('role', type === 'warning' ? 'alert' : 'status');

    const text = document.createElement('div');
    text.className = 'toast__text';
    text.textContent = message;
    toast.appendChild(text);

    if (actions && actions.length) {
        const actionsEl = document.createElement('div');
        actionsEl.className = 'toast__actions';
        actions.forEach(a => {
            const btn = document.createElement('button');
            btn.className = 'btn btn-ghost';
            btn.textContent = a.label;
            btn.onclick = () => { if (a.onClick) a.onClick(); remove(); };
            actionsEl.appendChild(btn);
        });
        toast.appendChild(actionsEl);
    }

    function remove() {
        toast.classList.add('toast--hide');
        setTimeout(() => toast.remove(), 260);
    }

    container.appendChild(toast);
    setTimeout(() => toast.classList.add('toast--show'), 10);

    if (timeout > 0) {
        let t = setTimeout(remove, timeout);
        toast.addEventListener('mouseenter', () => clearTimeout(t));
        toast.addEventListener('mouseleave', () => { t = setTimeout(remove, timeout); });
    }

    return {
        remove
    };
}

/* ========================
   CONFIRMATION DIALOG (ASYNC)
   ========================
   
   Shows a toast with Confirm/Cancel buttons
   Returns Promise that resolves to true (confirmed) or false (cancelled)
   */
function confirmToast(message, {confirmLabel='Confirmer', cancelLabel='Annuler'} = {}) {
    return new Promise(resolve => {
        const c = showToast(message, {type:'warning', timeout:0, actions:[{label:cancelLabel, onClick:() => resolve(false)},{label:confirmLabel, onClick:() => resolve(true)}]});
    });
}


/* ========================
   FOCUS TRAP - MODAL ACCESSIBILITY
   ========================
   
   Keeps keyboard focus within a modal dialog
   Prevents tabbing outside the modal when active
   Returns cleanup function to remove event listener
   */
function trapFocus(container) {
    const focusable = container.querySelectorAll('a[href], button, textarea, input, select, [tabindex]:not([tabindex="-1"])');
    if (!focusable.length) return () => {};
    let i = 0;
    function onKey(e) {
        if (e.key !== 'Tab') return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault(); last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault(); first.focus();
        }
    }
    document.addEventListener('keydown', onKey);
    // return cleanup
    return () => document.removeEventListener('keydown', onKey);
}
