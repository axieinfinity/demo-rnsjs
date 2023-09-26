import Document, { DocumentInitialProps, Head, Html, Main, NextScript } from "next/document"

class NextDocument extends Document<DocumentInitialProps> {
  render(): JSX.Element {
    return (
      <Html>
        <Head />

        <body className="overflow-x-hidden overflow-y-scroll">
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default NextDocument
