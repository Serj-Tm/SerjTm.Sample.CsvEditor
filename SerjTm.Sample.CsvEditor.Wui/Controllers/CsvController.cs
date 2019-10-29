using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using NitroBolt.Functional;

namespace SerjTm.Sample.CsvEditor.Wui.Controllers
{
    public class CsvController : Controller
    {
        public CsvController(IHostingEnvironment env)
        {
            Environment = env;

        }
        private IHostingEnvironment Environment;


        [HttpGet("api/csv/{filename}")]
        public object Csv(string filename)
        {
            //HACK
            filename = "f_tn_table_supplier.txt";

            const string separator = "\t";

            var fullFilename = Path.Combine(Environment.WebRootPath ?? Directory.GetCurrentDirectory(), "Data", filename);

            var lines = System.IO.File.ReadAllLines(fullFilename, Encoding.GetEncoding(1251));

            var columns = (lines[0]?.Split(separator)).OrEmpty();

            var rows = lines.Skip(1).Select(line => line.Split(separator));

            return new
            {
                columns, 
                rows
            };
        }

    }
}
