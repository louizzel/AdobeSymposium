using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using MySql.Data.MySqlClient;
using AdobeSymposium.DB;
using AdobeSymposium.Models;

namespace AdobeSymposium.Controllers
{
    public class RegistrationController : ApiController
    {
        readonly adobesymposiumdbEntities _entity = new adobesymposiumdbEntities();
        private readonly RoleController _roleCtrl = new RoleController();
        private readonly IndustryController _industryCtrl = new IndustryController();

        public int Get(string email)
        {
            return (from table in _entity.tblRegistrations1 where table.Email.Equals(email) select table.Id).FirstOrDefault();
        }

        public int Post(RegistrationForm data)
        {
            if (!ModelState.IsValid) return 0;
            var roleId = _roleCtrl.Get(data.role);
            data.role = roleId == 0 ? _roleCtrl.Post(new tblRole { RoleName = data.role }).ToString() : roleId.ToString();

            data.industry = _industryCtrl.Get(data.industry).ToString();

            _entity.tblRegistrations1.Add(data.Convert());
            _entity.SaveChanges();
            return Get(data.email);
        }
    }
}
