export const testData = {
    auth: {
        email: process.env.TEST_EMAIL || '<set-at-runtime>',
        password: process.env.TEST_PASSWORD || '<set-at-runtime>',
    },
    client: {
        name: 'Tessie Littel',
    },
    amounts: {
        issue: 5,
        delete: 1,
    },
    // Các cấu hình khác liên quan đến nghiệp vụ
    sessionTypeDefaults: {
        duration: '30 min',
        location: 'In-person',
    }
};
