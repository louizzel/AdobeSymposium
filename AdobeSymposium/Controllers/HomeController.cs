using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace AdobeSymposium.Controllers
{
    public class HomeController : Controller
    {
        public ActionResult Index()
        {
            return View();
        }

        public ActionResult Connect (string code, string state)
        {
            return Redirect("/#/register?code=" + code + "&state=" + state);
        }

        public ActionResult Retrieve()
        {
            return View();
        }
    }
}
