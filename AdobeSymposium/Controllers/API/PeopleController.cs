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
    public class PeopleController : ApiController
    {
        readonly adobesymposiumdbEntities entity = new adobesymposiumdbEntities();

        //Displays all the registered users for the event
        public List<Person> Get()
        {
            return (from table in entity.tblRegistrations1 select new Person { Id = table.Id, IndustryId = table.Industry, RoleId = table.Role, Visible = true }).ToList();
        }

        public List<Person> Put(int lastId)
        {
            return (from table in entity.tblRegistrations1 where table.Id > lastId select new Person { Id = table.Id, IndustryId = table.Industry, RoleId = table.Role, Visible = true }).ToList();
        }

        //Retrieves the list of users except the one signed in
        public List<Person> Get(int id)
        {
            return (from table in entity.tblRegistrations1 where table.Id != id
                select new Person {Id = table.Id, IndustryId = table.Industry, RoleId = table.Role, Visible = true}).ToList();
        }

        //Retrieves the details of the user being selected
        public CompleteProfile Get(int id, string user)
        {
            return (from table in entity.tblRegistrations1 where table.Id == id
                select new CompleteProfile
                {
                    Id = table.Id,
                    IndustryId = table.Industry,
                    RoleId = table.Role,
                    FirstName = table.FirstName,
                    LastName = table.LastName,
                    Company = table.Company,
                    Email = table.Email,
                    ContactNumber = table.ContactNumber,
                    ProfilePicture = table.ProfilePicture,
                    Facebook = table.Facebook,
                    GPlus = table.GPlus,
                    LinkedIn = table.LinkedIn,
                    Twitter = table.Twitter
                }).FirstOrDefault();
        }
    }
}
