// core/stores.js
// 状态管理

export class Store {
    constructor(initialState = {}) {
        this.state = initialState;
        this.listeners = [];
    }
    
    getState() {
        return this.state;
    }
    
    setState(newState) {
        this.state = { ...this.state, ...newState };
        this.notify();
    }
    
    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }
    
    notify() {
        this.listeners.forEach(listener => listener(this.state));
    }
}

// 全局应用状态
export const appStore = new Store({
    user: null,
    theme: 'light',
    sidebarOpen: true
});
