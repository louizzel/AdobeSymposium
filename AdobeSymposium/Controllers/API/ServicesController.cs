using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using AdobeSymposium.DB;
using AdobeSymposium.Models;

namespace AdobeSymposium.Controllers.API
{
    public class ServicesController : ApiController
    {
        readonly adobesymposiumdbEntities _entity = new adobesymposiumdbEntities();
        private readonly RoleController _roleCtrl = new RoleController();
        private readonly IndustryController _industryCtrl = new IndustryController();
        private readonly PeopleController _peopleCtrl = new PeopleController();

        public ProfileInformation Get(int id)
        {
            var result = new ProfileInformation
            {
                user = RetrieveUser(id),
                filters = RetrieveFilters()
            };
            return result;
        }

        public User RetrieveUser(int id)
        {
            return (from table in _entity.tblRegistrations1 where table.Id == id select new User { id = table.Id, name = table.FirstName + " " + table.LastName, role = table.Role, industry = table.Industry, company = table.Company, img = table.ProfilePicture, contactNumber = table.ContactNumber, facebook = table.Facebook, gplus = table.GPlus, linkedin = table.LinkedIn, twitter = table.Twitter }).SingleOrDefault();
        }

        public Filters RetrieveFilters()
        {
            return new Filters { industries = _industryCtrl.Get(0, 0), roles = _roleCtrl.Get(0, 0) };
        }

        public List<Lead> Get(string r, string i, int userId)
        {
            var roles = r.Split(',');
            var industries = i.Split(',');

            var result = new List<Lead>();

            foreach (string strRole in roles)
            {
                foreach (string strIndustry in industries)
                {
                    int industry = int.Parse(strIndustry);
                    var temp = (from table in _entity.tblRegistrations1
                                where
                                    table.Role.Equals(strRole) && table.Industry == industry &&
                                    table.Id != userId
                                select new Lead { id = table.Id, ind = table.Industry, ro = table.Role }).ToList();
                    result.AddRange(temp);
                }
            }

            return result;
        }

        //Retrieves the details of the user being selected
        public SelectedLead Get(int id, string user)
        {
            var temp = (from table in _entity.tblRegistrations1
                where table.Id == id
                select table).SingleOrDefault();

            if (temp != null)
            {
                var result = new SelectedLead
                {
                    id = temp.Id,
                    industry = temp.Industry,
                    role = temp.Role,
                    name = temp.FirstName + " " + temp.LastName,
                    company = temp.Company,
                    email = temp.Email,
                    contact = temp.ContactNumber,
                    img = temp.ProfilePicture,
                    social = new List<Social>(),
                };

                if (!string.IsNullOrEmpty(temp.Facebook))
                {
                    var tempSocial = new Social
                    {
                        media = "facebook",
                        link = temp.Facebook
                    };
                    result.social.Add(tempSocial);
                }

                if (!string.IsNullOrEmpty(temp.GPlus))
                {
                    var tempSocial = new Social
                    {
                        media = "gplus",
                        link = temp.GPlus
                    };
                    result.social.Add(tempSocial);
                }

                if (!string.IsNullOrEmpty(temp.LinkedIn))
                {
                    var tempSocial = new Social
                    {
                        media = "linkedin",
                        link = temp.LinkedIn
                    };
                    result.social.Add(tempSocial);
                }

                if (!string.IsNullOrEmpty(temp.Twitter))
                {
                    var tempSocial = new Social
                    {
                        media = "twitter",
                        link = temp.Twitter
                    };
                    result.social.Add(tempSocial);
                }
            }
            
            return new SelectedLead();
        }
    }
}
