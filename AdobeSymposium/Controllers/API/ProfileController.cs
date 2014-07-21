using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web.Mvc;
using AdobeSymposium.DB;
using AdobeSymposium.Models;

namespace AdobeSymposium.Controllers.API
{
    public class ProfileController : ApiController
    {
        readonly adobesymposiumdbEntities _entity = new adobesymposiumdbEntities();
        private readonly RoleController _roleCtrl = new RoleController();
        private readonly IndustryController _industryCtrl = new IndustryController();
        private readonly PeopleController _peopleCtrl = new PeopleController();

        //Update the profile of the user via id
        public void Post(tblRegistration data)
        {
            var temp = _entity.tblRegistrations1.Single(m => m.Id == data.Id);
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
            _entity.SaveChanges();
        }
    }
}
