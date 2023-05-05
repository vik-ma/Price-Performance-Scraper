export default function NotFound() {
  // Display this page if user types in Price Scrape ID that does not exist
  return (
    <>
      <title>Scrape ID Not Found</title>
      <div className="centered-container">
        <h1 id="error-header">Scrape ID not found!</h1>
      </div>
    </>
  );
}
