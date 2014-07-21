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
    public class DropdownController : ApiController
    {
        readonly adobesymposiumdbEntities entity = new adobesymposiumdbEntities();

        //Retrieves list of industry names and role names
        public Dropdowns Get()
        {
            try
            {
                return new Dropdowns
                {
                    Industries = (from table in entity.tblIndustries1 select table.IndustryName).ToList(),
                    Roles = (from table in entity.tblRoles1 select table.RoleName).ToList()
                };
            }
            catch (Exception exception)
            {
                throw new Exception("Please make sure you are connected to the internet. " + exception.Message);
            }
        }
    }
}
