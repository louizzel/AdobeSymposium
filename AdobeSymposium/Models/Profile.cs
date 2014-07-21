using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Security;
using AdobeSymposium.DB;

namespace AdobeSymposium.Models
{
    public class Person
    {
        public int Id { get; set; }
        public int IndustryId { get; set; }
        public string RoleId { get; set; }
        public bool Visible { get; set; }
    }

    //public class CompleteProfile
    //{
    //    public int Id { get; set; }
    //    public int IndustryId { get; set; }
    //    public string RoleId { get; set; }
    //    public string FirstName { get; set; }
    //    public string LastName { get; set; }
    //    public string Company { get; set; }
    //    public string Email { get; set; }
    //    public string ContactNumber { get; set; }
    //    public string ProfilePicture { get; set; }
    //    public string Facebook { get; set; }
    //    public string GPlus { get; set; }
    //    public string LinkedIn { get; set; }
    //    public string Twitter { get; set; }
    //}

    public class Profile
    {
        public List<Role> Roles { get; set; }
        public List<Industry> Industries { get; set; }
        public tblRegistration UserProfile { get; set; }
        public List<Person> People { get; set; }
    }

    public class Lead
    {
        public int id { get; set; }
        public int ind { get; set; }
        public string ro { get; set; }
    }

    public class MatchParams
    {
        public int[] roleIds { get; set; }
        public int[] industryIds { get; set; }
        public int userId { get; set; }
    }


    //for settings.json
    public class User
    {
        public int id { get; set; }
        public string name { get; set; }
        public string role { get; set; }
        public int industry { get; set; }
        public string company { get; set; }
        public string img { get; set; }
        public string contactNumber { get; set; }
        public string facebook { get; set; }
        public string gplus { get; set; }
        public string linkedin { get; set; }
        public string twitter { get; set; }
    }

    public class Filters
    {
        public List<Industry> industries { get; set; }
        public List<Role> roles { get; set; }
    }

    public class ProfileInformation
    {
        public User user { get; set; }
        public Filters filters { get; set; }
    }

    public class Social
    {
        public string media { get; set; }
        public string link { get; set; }
    }

    public class SelectedLead
    {
        public int id { get; set; }
        public string name { get; set; }
        public string img { get; set; }
        public string role { get; set; }
        public int industry { get; set; }
        public string company { get; set; }
        public string contact { get; set; }
        public string email { get; set; }
        public List<Social> social { get; set; }
    }
}