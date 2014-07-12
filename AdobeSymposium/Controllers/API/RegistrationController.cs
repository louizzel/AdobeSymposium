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
        readonly adobesymposiumdbEntities entity = new adobesymposiumdbEntities();
        private RoleController roleCtrl = new RoleController();
        private IndustryController industryCtrl = new IndustryController();

        public int Get(string email)
        {
            var id = (from table in entity.tblRegistrations1 where table.Email.Equals(email) select table.Id).FirstOrDefault();
            return id == null ? 0 : id;
        }

        public int Post(RegistrationForm data)
        {
            if (ModelState.IsValid)
            {
                var roleId = roleCtrl.Get(data.role);
                if (roleId == 0)
                    data.role = roleCtrl.Post(new tblRole { RoleName = data.role }).ToString();
                else
                    data.role = roleId.ToString();

                entity.tblRegistrations1.Add(data.Convert());
                entity.SaveChanges();
                return Get(data.email);
            }
            return 0;
        }
    }
}
