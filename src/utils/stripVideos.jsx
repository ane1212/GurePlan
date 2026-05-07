export function stripVideos(html = '') {
    return html
        .replace(/<iframe[\s\S]*?<\/iframe>/gi, '')
        .replace(/<video[\s\S]*?<\/video>/gi, '');
}