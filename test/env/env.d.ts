export { };

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            ENV: "staging" | "prod" | "test"
        }
    }
}