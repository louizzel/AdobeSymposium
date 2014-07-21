using System;
using System.Collections.Generic;
using System.Globalization;
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

        public List<Lead> Get(MatchParams data)
        {
            var result = new List<Lead>();

            foreach (int t1 in data.roleIds)
            {
                foreach (var temp in data.industryIds.Select(t => (from table in entity.tblRegistrations1
                    where table.Role.Equals(t1.ToString(CultureInfo.InvariantCulture)) && table.Industry == t && table.Id != data.userId
                    select new Lead {id = table.Id, ind = table.Industry, ro = table.Role}).ToList()))
                {
                    result.AddRange(temp);
                }
            }

            return result;
        }

        //Gets the list of matches of the user
        public List<tblRegistration> Get(int id, string type, int page)
        {
            return type.Equals("role") ? (from table in entity.tblRegistrations1 where table.Role.Equals(GetRoleOfUser(id)) select table).Skip((page - 1) * 30).Take(30).ToList() : (from table in entity.tblRegistrations1 where table.Industry == (GetIndustryOfUser(id)) select table).Skip((page - 1) * 30).Take(30).ToList();
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
            return (from table in entity.tblRegistrations1 where table.Id == id select table.Industry).FirstOrDefault();
            //return temp == null ? 0 : temp;
        }
    }
}
