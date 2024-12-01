// A generic 404 error page
const ErrorPage = () => {
  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <section className="text-center card border-secondary p-3">
        <h1>404: Page Not Found</h1>
        <h1>¯\_(ツ)_/¯</h1>
        <button className="btn btn-danger mt-4" onClick={handleGoBack}>
          Go Back
        </button>
      </section>
    </div>
  );
};

export default ErrorPage;