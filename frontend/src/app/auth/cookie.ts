export function getCookie(name: string): any {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);

    if (parts.length === 3){
        parts.pop();
    }

    if (parts.length === 2) return parts?.pop()?.split(';').shift();
};