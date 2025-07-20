import { Links, Meta, Outlet, Scripts } from "@remix-run/react";

export default function App() {
  return (
    <html>
      <head>
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com/"
          crossOrigin=""
        />
        <link
          rel="stylesheet"
          as="style"
          onLoad="this.rel='stylesheet'"
          href="https://fonts.googleapis.com/css2?display=swap&family=Inter%3Awght%40400%3B500%3B700%3B900&family=Noto+Sans%3Awght%40400%3B500%3B700%3B900"
        />

        <title>Docster</title>
        <link rel="icon" type="image/x-icon" href="data:image/x-icon;base64," />

        <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>

        <Meta />
        <Links />
      </head>
      <body>
        <div
          className="relative flex size-full min-h-screen flex-col bg-gray-50 group/design-root overflow-x-hidden"
          style={{ fontFamily: 'Inter, "Noto Sans", sans-serif' }}
        >
          <div className="layout-container flex h-full grow flex-col">
            <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-b-[#eaedf1] px-10 py-3">
              <div className="flex items-center gap-4 text-[#101518]">
                <h2 className="text-[#101518] text-xl font-bold leading-tight tracking-[-0.015em]">
                  Docster
                </h2>
              </div>
              <button className="flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded h-10 bg-[#eaedf1] text-[#101518] gap-2 text-sm font-bold leading-normal tracking-[0.015em] min-w-0 px-2.5">
                <div
                  className="text-[#101518]"
                  data-icon="GithubLogo"
                  data-size="20px"
                  data-weight="regular"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20px"
                    height="20px"
                    fill="currentColor"
                    viewBox="0 0 256 256"
                  >
                    <path d="M208.31,75.68A59.78,59.78,0,0,0,202.93,28,8,8,0,0,0,196,24a59.75,59.75,0,0,0-48,24H124A59.75,59.75,0,0,0,76,24a8,8,0,0,0-6.93,4,59.78,59.78,0,0,0-5.38,47.68A58.14,58.14,0,0,0,56,104v8a56.06,56.06,0,0,0,48.44,55.47A39.8,39.8,0,0,0,96,192v8H72a24,24,0,0,1-24-24A40,40,0,0,0,8,136a8,8,0,0,0,0,16,24,24,0,0,1,24,24,40,40,0,0,0,40,40H96v16a8,8,0,0,0,16,0V192a24,24,0,0,1,48,0v40a8,8,0,0,0,16,0V192a39.8,39.8,0,0,0-8.44-24.53A56.06,56.06,0,0,0,216,112v-8A58.14,58.14,0,0,0,208.31,75.68ZM200,112a40,40,0,0,1-40,40H112a40,40,0,0,1-40-40v-8a41.74,41.74,0,0,1,6.9-22.48A8,8,0,0,0,80,73.83a43.81,43.81,0,0,1,.79-33.58,43.88,43.88,0,0,1,32.32,20.06A8,8,0,0,0,119.82,64h32.35a8,8,0,0,0,6.74-3.69,43.87,43.87,0,0,1,32.32-20.06A43.81,43.81,0,0,1,192,73.83a8.09,8.09,0,0,0,1,7.65A41.72,41.72,0,0,1,200,104Z" />
                  </svg>
                </div>
              </button>
            </header>
            <div className="gap-1 px-6 flex flex-1 justify-center py-5">
              <div className="layout-content-container flex flex-col w-80">
                <h2 className="text-[#101518] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
                  Uploaded Files
                </h2>
                <div className="flex flex-col p-4">
                  <div className="flex flex-col items-center gap-6 rounded-xl border-2 border-dashed border-[#d4dce2] px-6 py-14">
                    <div className="flex max-w-[480px] flex-col items-center gap-2">
                      <p className="text-[#101518] text-lg font-bold leading-tight tracking-[-0.015em] max-w-[480px] text-center">
                        Drag and drop a PDF here
                      </p>
                      <p className="text-[#101518] text-sm font-normal leading-normal max-w-[480px] text-center">
                        Or click to browse
                      </p>
                    </div>
                    <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-10 px-4 bg-[#eaedf1] text-[#101518] text-sm font-bold leading-normal tracking-[0.015em]">
                      <span className="truncate">Upload PDF</span>
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-gray-50 px-4 min-h-[72px] py-2 justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className="text-[#101518] flex items-center justify-center rounded bg-[#eaedf1] shrink-0 size-12"
                      data-icon="File"
                      data-size="24px"
                      data-weight="regular"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24px"
                        height="24px"
                        fill="currentColor"
                        viewBox="0 0 256 256"
                      >
                        <path d="M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160ZM200,216H56V40h88V88a8,8,0,0,0,8,8h48V216Z" />
                      </svg>
                    </div>
                    <div className="flex flex-col justify-center">
                      <p className="text-[#101518] text-base font-medium leading-normal line-clamp-1">
                        Document 1.pdf
                      </p>
                      <p className="text-[#5c748a] text-sm font-normal leading-normal line-clamp-2">
                        2.5 MB
                      </p>
                    </div>
                  </div>
                  <div className="shrink-0">
                    <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded h-8 px-4 bg-[#eaedf1] text-[#101518] text-sm font-medium leading-normal w-fit">
                      <span className="truncate">Remove</span>
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-gray-50 px-4 min-h-[72px] py-2 justify-between">
                  <div className="flex items-center gap-4">
                    <div
                      className="text-[#101518] flex items-center justify-center rounded bg-[#eaedf1] shrink-0 size-12"
                      data-icon="File"
                      data-size="24px"
                      data-weight="regular"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24px"
                        height="24px"
                        fill="currentColor"
                        viewBox="0 0 256 256"
                      >
                        <path d="M213.66,82.34l-56-56A8,8,0,0,0,152,24H56A16,16,0,0,0,40,40V216a16,16,0,0,0,16,16H200a16,16,0,0,0,16-16V88A8,8,0,0,0,213.66,82.34ZM160,51.31,188.69,80H160ZM200,216H56V40h88V88a8,8,0,0,0,8,8h48V216Z" />
                      </svg>
                    </div>
                    <div className="flex flex-col justify-center">
                      <p className="text-[#101518] text-base font-medium leading-normal line-clamp-1">
                        Report 2024.pdf
                      </p>
                      <p className="text-[#5c748a] text-sm font-normal leading-normal line-clamp-2">
                        1.8 MB
                      </p>
                    </div>
                  </div>
                  <div className="shrink-0">
                    <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded h-8 px-4 bg-[#eaedf1] text-[#101518] text-sm font-medium leading-normal w-fit">
                      <span className="truncate">Remove</span>
                    </button>
                  </div>
                </div>
                <div className="flex px-4 py-3">
                  <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded h-10 px-4 flex-1 bg-[#dce8f3] text-[#101518] text-sm font-bold leading-normal tracking-[0.015em]">
                    <span className="truncate">Process Files</span>
                  </button>
                </div>
              </div>
              <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
                <div className="pb-3">
                  <div className="flex border-b border-[#d4dce2] px-4 justify-between">
                    <a
                      className="flex flex-col items-center justify-center border-b-[3px] border-b-[#dce8f3] text-[#101518] pb-[13px] pt-4 flex-1"
                      href="#"
                    >
                      <p className="text-[#101518] text-sm font-bold leading-normal tracking-[0.015em]">
                        JSON
                      </p>
                    </a>
                    <a
                      className="flex flex-col items-center justify-center border-b-[3px] border-b-transparent text-[#5c748a] pb-[13px] pt-4 flex-1"
                      href="#"
                    >
                      <p className="text-[#5c748a] text-sm font-bold leading-normal tracking-[0.015em]">
                        CSV
                      </p>
                    </a>
                  </div>
                </div>
                <div className="flex flex-col px-4 py-6">
                  <div className="flex flex-col items-center gap-6">
                    <div className="flex max-w-[480px] flex-col items-center gap-2">
                      <p className="text-[#101518] text-lg font-bold leading-tight tracking-[-0.015em] max-w-[480px] text-center">
                        No conversion results yet
                      </p>
                      <p className="text-[#101518] text-sm font-normal leading-normal max-w-[480px] text-center">
                        Process the uploaded files to see the structured data
                        here.
                      </p>
                    </div>
                  </div>
                </div>
                <Outlet />
              </div>
            </div>
          </div>
        </div>

        <Scripts />
      </body>
    </html>
  );
}
