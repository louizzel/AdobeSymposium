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

        [DataType(DataType.EmailAddress)]
        public string linkedIn { get; set; }

        [StringLength(50)]
        public string twitter { get; set; }

        [StringLength(50)]
        [DataType(DataType.EmailAddress)]
        public string gPlus { get; set; }

        public string profilePicture { get; set; }

        public tblRegistration Convert()
        {
            var temp = new tblRegistration();
            temp.FirstName = this.firstName;
            temp.LastName = this.lastName;
            temp.Company = this.company;
            temp.Email = this.email;
            temp.Password = this.password;
            temp.ContactNumber = this.contactNumber;
            temp.Industry = int.Parse(this.industry);
            temp.Role = this.role.Trim();
            temp.LinkedIn = this.linkedIn;
            temp.Twitter = this.twitter;
            temp.GPlus = this.gPlus;
            temp.ProfilePicture = this.profilePicture;
            temp.Timestamp = DateTime.Now;

            return temp;
        }
    }
}