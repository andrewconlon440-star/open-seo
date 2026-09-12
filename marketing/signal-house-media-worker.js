export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.hostname === "www.signalhousemedia.com.au") {
      url.hostname = "signalhousemedia.com.au";
      return Response.redirect(url.toString(), 301);
    }

    return env.ASSETS.fetch(request);
  },
};
