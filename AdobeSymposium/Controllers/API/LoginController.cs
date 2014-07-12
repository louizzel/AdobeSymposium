using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using AdobeSymposium.DB;
using AdobeSymposium.Models;

namespace AdobeSymposium.Controllers.API
{
    public class LoginController : ApiController
    {
        readonly adobesymposiumdbEntities entity = new adobesymposiumdbEntities();

        public string Get(string email, string password)
        {
            var temp = (from table in entity.tblRegistrations1 where table.Email.Equals(email) select table.Id).FirstOrDefault();
            if ((from table in entity.tblRegistrations1 where table.Email.Equals(email) select table.Id).FirstOrDefault() == 0)
                return "Are you sure you used the correct email?";
            else if ((from table in entity.tblRegistrations1 where table.Email.Equals(email) && table.Password.Equals(password) select table.Id).FirstOrDefault() == 0)
                return "Are you sure about your password?";
            else
                return "Ok." + entity.tblRegistrations1.Where(m => m.Email.Equals(email) && m.Password.Equals(password)).Select(m => m.Id).FirstOrDefault();
        }
    }
}
