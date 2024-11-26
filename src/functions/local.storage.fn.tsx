export const localStorageFn = {
    getItem : (key: any) => {
        return JSON.parse(localStorage.getItem(key as string) || '{}');
    },
    setItem : (key, value) => {
        return localStorage.setItem(key,JSON.stringify(value));
    }
}