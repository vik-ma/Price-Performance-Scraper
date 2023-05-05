// Needs the page.tsx in app/[...not_found] to function correctly
export default function NotFound() {
  return (
    <>
      <title>404 - Page Not Found</title>
      <div className="centered-container">
        <h1 id="error-header">404 - Page not found!</h1>
      </div>
    </>
  );
}
