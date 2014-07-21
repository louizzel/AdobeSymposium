using AdobeSymposium.DB;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace AdobeSymposium.Models
{
    public class RegistrationForm
    {
        [Required]
        [StringLength(30)]
        public string firstName { get; set; }

        [Required]
        [StringLength(30)]
        public string lastName { get; set; }

        [Required]
        [StringLength(100)]
        public string company { get; set; }

        [Required]
        [StringLength(254)]
        [DataType(DataType.EmailAddress)]
        public string email { get; set; }

        [Required]
        [StringLength(254)]
        public string password { get; set; }

        [StringLength(254)]
        public string confirmPassword { get; set; }

        [Required]
        [StringLength(30)]
        [DataType(DataType.PhoneNumber)]
        public string contactNumber { get; set; }

        [Required]
        [StringLength(30)]
        public string industry { get; set; }

        [Required]
        [StringLength(30)]
        public string role { get; set; }

        [StringLength(30)]
        public string otherRole { get; set; }

        [StringLength(254)]
        public string facebook { get; set; }

        [StringLength(254)]
        public string gPlus { get; set; }

        [StringLength(254)]
        public string linkedIn { get; set; }

        [StringLength(254)]
        public string twitter { get; set; }
        
        public string profilePicture { get; set; }

        public tblRegistration Convert()
        {
            var temp = new tblRegistration();
            temp.FirstName = this.firstName.Trim();
            temp.LastName = this.lastName.Trim();
            temp.Company = this.company.Trim();
            temp.Email = this.email.Trim();
            temp.Password = this.password;
            temp.ContactNumber = this.contactNumber;
            temp.Industry = int.Parse(this.industry);
            temp.Role = this.role.Trim();
            temp.OtherRole = string.IsNullOrEmpty(this.otherRole) ? "" : this.otherRole.Trim();
            temp.Facebook = this.facebook;
            temp.LinkedIn = this.linkedIn;
            temp.Twitter = this.twitter;
            temp.GPlus = this.gPlus;
            
            temp.ProfilePicture = string.IsNullOrEmpty(this.profilePicture) ? "/Images/default.png" : this.profilePicture;
            temp.Timestamp = DateTime.Now;

            return temp;
        }
    }

    public class Industry
    {
        public int industryId { get; set; }
        public string industryName { get; set; }
        public bool visible { get; set; }
    }

    public class Role
    {
        public int roleId { get; set; }
        public string roleName { get; set; }
        public bool visible { get; set; }
    }

    public class Dropdowns
    {
        public List<string> Industries { get; set; }
        public List<string> Roles { get; set; }
    }
}