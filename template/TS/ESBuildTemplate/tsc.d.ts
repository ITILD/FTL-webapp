declare module "src/TemplateMore" {
    class TemplateMore0 {
        constructor();
    }
    function TemplateMore1(params: String): void;
    export { TemplateMore0, TemplateMore1 };
}
declare module "src/TemplateDefault" {
    class TemplateDefault {
        constructor();
    }
    export default TemplateDefault;
}
declare module "index" {
    export { TemplateMore0, TemplateMore1 } from "src/TemplateMore";
    export { default as TemplateDefault } from "src/TemplateDefault";
}
//# sourceMappingURL=tsc.d.ts.map