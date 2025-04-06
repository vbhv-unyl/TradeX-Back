module.exports = {
    connection: jest.fn().mockImplementation((url) => {
        console.log(`Mock: Connected to database at ${url}`);
        return Promise.resolve(true);
    })
};
