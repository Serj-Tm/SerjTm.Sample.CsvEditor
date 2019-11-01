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


        [HttpPost("api/csv/{filename}")]
        public object Csv_Parse(string filename, [FromBody] Csv_Parse_Request request)
        {
            //HACK
            filename = "q.txt";

            //const string separator = "\t";

            var fullFilename = Path.Combine(Environment.WebRootPath ?? Directory.GetCurrentDirectory(), "Data", filename);

            var lines = System.IO.File.ReadAllLines(fullFilename, Encoding.GetEncoding(1251));

            var headers = (lines[0]?.Split(request.Separator)).OrEmpty();

            var rows = lines.Skip(1).Select(line => line.Split(request.Separator));

            return new
            {
                headers, 
                rows,
                separator = request.Separator
            };
        }
        [HttpPut("api/csv/{filename}/headers")]
        public object Csv_SetHeaders(string filename, [FromBody]Csv_SetHeaders_Request request)
        {
            //HACK
            filename = "q.txt";

            const string separator = "\t";

            var fullFilename = Path.Combine(Environment.WebRootPath ?? Directory.GetCurrentDirectory(), "Data", filename);

            var lines = System.IO.File.ReadAllLines(fullFilename, Encoding.GetEncoding(1251));

            var newLines = new[] { request.Headers.JoinToString(separator) }.Concat(lines.Skip(1)).ToArray();

            System.IO.File.WriteAllLines(fullFilename, newLines, Encoding.GetEncoding(1251));

            return Ok();
        }

    }

    public class Csv_SetHeaders_Request
    {
        public string[] Headers;
    }
    public class Csv_Parse_Request
    {
        public string Separator;
        public bool IsHeader; 
    }
}
