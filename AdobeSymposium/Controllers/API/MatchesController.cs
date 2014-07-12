using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using AdobeSymposium.DB;
using AdobeSymposium.Models;

namespace AdobeSymposium.Controllers
{
    public class MatchesController : ApiController
    {
        readonly adobesymposiumdbEntities entity = new adobesymposiumdbEntities();

        //Gets the list of matches of the user
        public List<tblRegistration> Get(int id, string type, int page)
        {
            var result = new List<tblRegistration>();
            if (type.Equals("role"))
                result = (from table in entity.tblRegistrations1 where table.Role.Equals(GetRoleOfUser(id)) select table).Skip((page - 1) * 30).Take(30).ToList();
            else
                result = (from table in entity.tblRegistrations1 where table.Industry == (GetIndustryOfUser(id)) select table).Skip((page - 1) * 30).Take(30).ToList();
            return result;
        }

        //Get the role id of the user
        public string GetRoleOfUser(int id)
        {
            var temp = (from table in entity.tblRegistrations1 where table.Id == id select table.Role).FirstOrDefault();
            return temp == null ? "0" : temp.ToString();
        }

        //Get the industry id of the user
        public int GetIndustryOfUser(int id)
        {
            var temp = (from table in entity.tblRegistrations1 where table.Id == id select table.Industry).FirstOrDefault();
            return temp == null ? 0 : temp;
        }
    }
}
