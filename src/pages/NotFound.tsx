import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <>
      <Helmet>
        <title>Page Not Found — SUCYNTRA DDI Predictor</title>
        <meta name="description" content="The page you're looking for doesn't exist. Return to the SUCYNTRA DDI Predictor home to check drug interactions." />
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href="https://sucyntraddip.lovable.app/404" />
        <meta property="og:title" content="Page Not Found — SUCYNTRA DDI Predictor" />
        <meta property="og:description" content="The page you're looking for doesn't exist." />
        <meta property="og:url" content="https://sucyntraddip.lovable.app/404" />
      </Helmet>
      <main className="flex min-h-screen items-center justify-center bg-muted">
        <div className="text-center">
          <h1 className="mb-4 text-4xl font-bold">404</h1>
          <p className="mb-4 text-xl text-muted-foreground">Oops! Page not found</p>
          <a href="/" className="text-primary underline hover:text-primary/90">
            Return to Home
          </a>
        </div>
      </main>
    </>
  );
};

export default NotFound;
