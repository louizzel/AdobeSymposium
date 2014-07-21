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
        readonly adobesymposiumdbEntities _entity = new adobesymposiumdbEntities();

        public List<Role> Get()
        {
            return (from table in _entity.tblRoles1 select new Role { roleId = table.Id, roleName = table.RoleName, visible = true}).ToList();
        }

        public int Get(string roleName)
        {
            var temp = (from table in _entity.tblRoles1 where table.RoleName.Equals(roleName) select table).FirstOrDefault();
            return temp == null ? 0 : temp.Id;
        }

        public int Post(tblRole data)
        {
            if (string.IsNullOrEmpty(data.RoleName.Trim())) return 0;
            _entity.tblRoles1.Add(data);
            _entity.SaveChanges();
            return data.Id;
        }
    }
}
