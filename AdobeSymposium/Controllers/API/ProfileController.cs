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
        readonly adobesymposiumdbEntities _entity = new adobesymposiumdbEntities();
        private readonly RoleController _roleCtrl = new RoleController();
        private readonly IndustryController _industryCtrl = new IndustryController();
        private readonly PeopleController _peopleCtrl = new PeopleController();

        //Get profile of user via Id
        public Profile Get(int id)
        {
            var result = new Profile
            {
                Roles = _roleCtrl.Get(),
                Industries = _industryCtrl.Get(0, 0),
                People = _peopleCtrl.Get(id),
                UserProfile = (from table in _entity.tblRegistrations1 where table.Id == id select table).SingleOrDefault()
            };
            return result;
        }

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
