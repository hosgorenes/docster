import { Links, Meta, Outlet, Scripts } from "@remix-run/react";
import { Layout } from "./components";

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
          href="https://fonts.googleapis.com/css2?display=swap&family=Inter%3Awght%40400%3B500%3B700%3B900&family=Noto+Sans%3Awght%40400%3B500%3B700%3B900"
        />

        <title>Docster</title>
        <link rel="icon" type="image/x-icon" href="data:image/x-icon;base64," />

        <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>

        <Meta />
        <Links />
      </head>
      <body>
        <Layout>
          <Outlet />
        </Layout>

        <Scripts />
      </body>
    </html>
  );
}
