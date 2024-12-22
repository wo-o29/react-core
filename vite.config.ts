import fs from "fs";
import path from "path";
import { defineConfig } from "vite"; // vite 설정 정의

export default defineConfig({
  esbuild: {
    jsxFactory: "createElement", // JSX를 변환할 때 사용할 함수 이름 지정
    jsxFragment: "Fragment", // Fragment(<></>)를 변환할 때 사용할 함수 이름 지정
    jsxInject: `import { createElement, Fragment } from "${path.resolve(
      __dirname,
      "src/dom/jsx"
    )}"`, // 헬퍼 함수(자동 import)
  },
  optimizeDeps: {
    esbuildOptions: {
      // esbuild에 사용할 플러그인 정의
      plugins: [
        {
          name: "load-ts-files-as-jsx",
          setup(build) {
            // 파일 읽을 때 어떻게 처리할지 설정
            build.onLoad({ filter: /\.(ts|tsx)$/ }, async (args) => ({
              loader: "tsx", // TypeScript와 tsx 파일을 처리할 수 있는 로더 지정
              contents: await fs.promises.readFile(args.path, "utf8"), // 파일 내용 읽기
            }));
          },
        },
      ],
    },
  },
});
