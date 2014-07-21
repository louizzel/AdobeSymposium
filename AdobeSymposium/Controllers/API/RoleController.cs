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
            return (from table in _entity.tblRoles1 select new Role { id = table.Id, name = table.RoleName}).ToList();
        }

        public int Get(string roleName)
        {
            var temp = (from table in _entity.tblRoles1 where table.RoleName.Equals(roleName) select table).FirstOrDefault();
            return temp == null ? 0 : temp.Id;
        }

        public List<Role> Get(int x, int y)
        {
            return (from table in _entity.tblRegistrations1 join table2 in _entity.tblRoles1 on table.Id equals table2.Id select new Role { id = table.Id, name = table2.RoleName }).Distinct().ToList();
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
