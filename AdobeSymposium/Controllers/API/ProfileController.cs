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
    public class ProfileController : ApiController
    {
        readonly adobesymposiumdbEntities entity = new adobesymposiumdbEntities();
        private RoleController roleCtrl = new RoleController();
        private IndustryController industryCtrl = new IndustryController();

        //Get profile of user via Id
        public tblRegistration Get(int id)
        {
            return (from table in entity.tblRegistrations1 where table.Id == id select table).SingleOrDefault();
        }

        //Update the profile of the user via id
        public void Post(tblRegistration data)
        {
            var temp = entity.tblRegistrations1.Single(m => m.Id == data.Id);
            temp.FirstName = data.FirstName;
            temp.LastName = data.LastName;
            temp.Company = data.Company;
            temp.Email = data.Email;
            temp.ContactNumber = data.ContactNumber;
            temp.Industry = data.Industry;
            temp.Role = data.Role;
            temp.LinkedIn = data.LinkedIn;
            temp.Twitter = data.Twitter;
            temp.GPlus = data.GPlus;
            temp.ProfilePicture = data.ProfilePicture;
            temp.Timestamp = DateTime.Now;
            entity.SaveChanges();
        }
    }
}
