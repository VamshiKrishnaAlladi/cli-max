module.exports = {
    "collectCoverage": true,
    "globals": {
        "ts-jest": {
            "tsConfigFile": "./ts-jest.tsconfig.json"
        }
    },
    "transformIgnorePatterns": [
        "node_modules/(?!(@vka/ts-utils))"
    ],
    "transform": {
        "^.+\\.(js|jsx|ts|tsx)$": "ts-jest"
    },
    "testRegex": "(/__tests__/.*|(\\.|/)(test|spec))\\.(jsx?|tsx?)$",
    "moduleFileExtensions": [
        "ts",
        "tsx",
        "js",
        "jsx",
        "json",
        "node"
    ]
};