using System;
using System.Collections.Generic;
using System.Configuration;
using System.Globalization;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using TweetSharp;

namespace AdobeSymposium.Controllers
{
    public class TwitterController : Controller
    {
        public ActionResult Index()
        {
            // Step 1 - Retrieve an OAuth Request Token
            var service = new TwitterService("YBYrk8IW2Pj9wtwzB7Gf62xSd", "DE1b1EewzZ3QnuD9wzDJio8P7mcXtQq6ximAB8jtI8mDnGYDXq");

            // This is the registered callback URL
            OAuthRequestToken requestToken = service.GetRequestToken("http://" + Request.Url.Authority + "/Twitter/AuthorizeCallback");

            // Step 2 - Redirect to the OAuth Authorization URL
            Uri uri = service.GetAuthorizationUri(requestToken);
            return new RedirectResult(uri.ToString(), false /*permanent*/);
        }

        public ActionResult AuthorizeCallback(string oauth_token, string oauth_verifier)
        {
            var requestToken = new OAuthRequestToken { Token = oauth_token };

            // Step 3 - Exchange the Request Token for an Access Token
            var service = new TwitterService(ConfigurationManager.AppSettings["TwitterConsumerKey"], ConfigurationManager.AppSettings["TwitterConsumerSecret"]);
            OAuthAccessToken accessToken = service.GetAccessToken(requestToken, oauth_verifier);

            // Step 4 - User authenticates using the Access Token
            service.AuthenticateWith(accessToken.Token, accessToken.TokenSecret);
            TwitterUser user = service.VerifyCredentials(new VerifyCredentialsOptions());

            TempData["FirstName"] = user.Name;
            TempData["ProfilePicture"] = user.ProfileImageUrl;
            TempData["ScreenName"] = "http://www.twitter.com/" + user.ScreenName;

            var options = new SendTweetOptions();
            options.Status = "Hello, I'm using TweetSharp to tweet this!";
            TwitterStatus result = service.SendTweet(options);

            return RedirectToAction("Connected", "Twitter");
        }

        public ActionResult Connected()
        {
            return View();
        }
    }
}
