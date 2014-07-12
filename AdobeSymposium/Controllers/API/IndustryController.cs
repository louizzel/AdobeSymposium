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

        //Gets the list of industries from the database
        public List<Industry> Get()
        {
            return (from table in entity.tblIndustries1 select new Industry { industryId = table.Id, industryName = table.IndustryName }).ToList();
        }

        public int Get(string industry)
        {
            return (from table in entity.tblIndustries1 where table.IndustryName.Equals(industry.Replace("and","&").Trim()) select table.Id).FirstOrDefault();
        }
    }
}
