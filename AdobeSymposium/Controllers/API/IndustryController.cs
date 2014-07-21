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
    public class IndustryController : ApiController
    {
        readonly adobesymposiumdbEntities entity = new adobesymposiumdbEntities();
        
        //Retrieves all the industries from the database (dropdown population)
        public List<Industry> Get()
        {
            return (from table in entity.tblIndustries1 select new Industry { id = table.Id, name = table.IndustryName}).ToList();
        }

        //Retrieves list of industry names
        public List<string> Get(int id)
        {
            return (from table in entity.tblIndustries1 select table.IndustryName).ToList();
        }

        //Retrieves industry Id of given industry name
        public int Get(string industry)
        {
            return (from table in entity.tblIndustries1 where table.IndustryName.Equals(industry.Replace("and","&").Trim()) select table.Id).FirstOrDefault();
        }

        //Retrieves all the industries of the registered participants
        public List<Industry> Get(int x, int y)
        {
            return (from table in entity.tblIndustries1 join table2 in entity.tblRegistrations1 on table.Id equals table2.Industry select new Industry { id = table.Id, name = table.IndustryName }).Distinct().ToList();
        }
    }
}
