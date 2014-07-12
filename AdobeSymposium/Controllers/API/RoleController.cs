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
    public class RoleController : ApiController
    {
        readonly adobesymposiumdbEntities entity = new adobesymposiumdbEntities();

        public int Get(string roleName)
        {
            var temp = (from table in entity.tblRoles1 where table.RoleName.Equals(roleName) select table).FirstOrDefault();
            return temp == null ? 0 : temp.Id;
        }

        public int Post(tblRole data)
        {
            if(!string.IsNullOrEmpty(data.RoleName.Trim()))
            {
                entity.tblRoles1.Add(data);
                entity.SaveChanges();
                return data.Id;
            }
            return 0;
        }
    }
}
